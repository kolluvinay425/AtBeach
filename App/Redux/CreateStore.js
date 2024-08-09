import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import R from 'ramda';

import Config from '../Config/DebugSettings';
import Reactotron from '../Config/ReactotronConfig';

import {persistReducer, persistStore} from 'redux-persist';
import deepMerge from 'redux-persist/lib/stateReconciler/deepMerge';
import AsyncStorage from '@react-native-community/async-storage';
import {createFilter} from 'redux-persist-transform-filter';

export const CACHE_DISPOSABLE = ['beachSpots', 'startup'];

const startupVariablesFilter = createFilter('startup', [
  'initVariables',
  'lastCacheExpire',
]);

const beachSpotsFilter = createFilter('beachSpots', ['favorites']);

const persistConfig = {
  key: 'root',
  timeout: null,
  storage: AsyncStorage,
  stateReconciler: deepMerge,
  whitelist: ['userAuth', 'appPersisted'].concat(CACHE_DISPOSABLE),
  transforms: [startupVariablesFilter, beachSpotsFilter],
};

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = __DEV__ ? Reactotron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);

  /* ------------- Logger Middleware ------------- */

  const exceptions = [
    // 'REACT_NATIVE_ROUTER_FLUX_BACK',
    // 'REACT_NATIVE_ROUTER_FLUX_BACK_ACTION',
    // 'REACT_NATIVE_ROUTER_FLUX_FOCUS',
    // 'REACT_NATIVE_ROUTER_FLUX_JUMP',
    // 'REACT_NATIVE_ROUTER_FLUX_POP_AND_REPLACE',
    // 'REACT_NATIVE_ROUTER_FLUX_POP_TO',
    // 'REACT_NATIVE_ROUTER_FLUX_PUSH',
    // 'REACT_NATIVE_ROUTER_FLUX_REFRESH',
    // 'REACT_NATIVE_ROUTER_FLUX_REPLACE',
    // 'REACT_NATIVE_ROUTER_FLUX_RESET',
    'EFFECT_TRIGGERED',
    'EFFECT_RESOLVED',
    'EFFECT_REJECTED',
    'persist/REHYDRATE',
  ];

  if (__DEV__) {
    // the logger master switch
    const USE_LOGGING = Config.reduxLogging;
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, {type}) =>
        USE_LOGGING && R.not(R.contains(type, exceptions)),
    });
    middleware.push(logger);
  }

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  /* ------------- AutoRehydrate Enhancer ------------- */

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  let store = null;

  if (__DEV__) {
    store = createStore(
      persistedReducer,
      compose(
        ...enhancers,
        Reactotron.createEnhancer(),
      ),
    );
  } else {
    store = createStore(persistedReducer, compose(...enhancers));
  }

  const persistor = persistStore(store);

  // // configure persistStore and check reducer version number
  // if (ReduxPersist.active) {
  //   RehydrationServices.updateReducers(store);
  // }

  // kick off root saga
  sagaMiddleware.run(rootSaga);

  return {store, persistor};
};
