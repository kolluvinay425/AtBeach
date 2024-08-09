// @flow

import {combineReducers} from 'redux';

import configureStore, {CACHE_DISPOSABLE} from './CreateStore';
import rootSaga from '../Sagas/';
import R from 'ramda';
import moment from 'moment';

// import navReducer from "./NavRedux";

//THIS EMPTY STATES IS USED TO RESET ALL THE STATES ON LOGOUT
const EMPTY_STATES = {
  appVolatile: require('./AppVolatileRedux').INITIAL_STATE,
  startup: require('./StartupRedux').INITIAL_STATE,
  userAuth: require('./UserAuthRedux').INITIAL_STATE,
  beachSpots: require('./BeachSpotRedux').INITIAL_STATE,
  orders: require('./OrderRedux').INITIAL_STATE,
};

const createStore = () => {
  /* ------------- Assemble The Reducers ------------- */

  const combinedReducer = combineReducers({
    appVolatile: require('./AppVolatileRedux').reducer,
    appPersisted: require('./AppPersistedRedux').reducer,
    startup: require('./StartupRedux').reducer,
    userAuth: require('./UserAuthRedux').reducer,
    beachSpots: require('./BeachSpotRedux').reducer,
    orders: require('./OrderRedux').reducer,
  });

  const rootReducer = (state, action) => {
    if (action.type == 'EXPIRE_CACHE') {
      const newState = R.clone(state);
      for (let i = 0; i < CACHE_DISPOSABLE.length; i++) {
        newState[CACHE_DISPOSABLE[i]] = R.clone(
          EMPTY_STATES[CACHE_DISPOSABLE[i]],
        );
      }
      newState.startup.lastCacheExpire = moment().toDate();
      state = newState;
    }

    return combinedReducer(state, action);
  };

  return configureStore(rootReducer, rootSaga);
};

const {store, persistor} = createStore();

export {store, persistor};
