// @flow

import {createActions, createReducer} from 'reduxsauce';
import R from 'ramda';
import I18n from 'i18n-js';
import {SEARCH_INDEX} from '../Lib/TextSearch';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  startup: null,
  initialized: null,
  initializing: null,
  setConnectionStatus: ['data'],
  forceConnectedStatus: null,
  getMinAppVersionRequest: null,
  getMinAppVersionSuccess: ['data'],
  getInitVariablesRequest: null,
  getInitVariablesSuccess: ['data'],
  forceUpdate: null,
  startupFailure: ['data'],
});

export const StartupTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  isFetching: false,
  isReady: false,
  connectionStatus: {
    isConnected: true,
    isInternetReachable: true,
  },
  minAppVersion: undefined,
  forceUpdate: false,
  initVariables: {
    places: {},
  },
  error: {},
};

const request = (state: Object) =>
  R.evolve(
    {
      isReady: R.F,
    },
    state,
  );

const success = (state: Object) =>
  R.evolve(
    {
      isReady: R.T,
    },
    state,
  );

const setConnectionStatus = (state: Object, action: Object) =>
  R.evolve(
    {
      connectionStatus: () => action.data,
    },
    state,
  );

const forceConnectedStatus = (state: Object, action: Object) =>
  R.evolve(
    {
      connectionStatus: {
        isConnected: R.T,
        isInternetReachable: R.T,
      },
    },
    state,
  );

const getMinAppVersionSuccess = (state: Object, action: Object) =>
  R.evolve(
    {
      minAppVersion: () => action.data,
    },
    state,
  );

const getInitVariablesRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      isFetching: R.T,
    },
    state,
  );
};
const getInitVariablesSuccess = (state: Object, action: Object) => {
  I18n.active_locales = action.data.locales_available;

  // Object.keys(action.data.places.cities).map(city => {
  //   action.data.places.cities[city].latitude = parseFloat(action.data.places.cities[city].latitude)
  //   action.data.places.cities[city].longitude = parseFloat(action.data.places.cities[city].longitude)
  // })

  if (action.data.places && action.data.places.cities) {
    Object.keys(action.data.places.cities).forEach(cityId => {
      SEARCH_INDEX.add(
        `city_${cityId}`,
        `${action.data.places.cities[cityId].name[I18n.locale]}`,
      );
    });
  }
  return R.evolve(
    {
      isFetching: R.F,
      initVariables: () => action.data,
    },
    state,
  );
};

const forceUpdate = (state: Object) =>
  R.evolve(
    {
      forceUpdate: R.T,
    },
    state,
  );

const failure = (state: Object, action: Object) =>
  R.evolve(
    {
      error: () => action.data,
    },
    state,
  );

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INITIALIZED]: success, // OK
  [Types.INITIALIZING]: request, // OK
  [Types.SET_CONNECTION_STATUS]: setConnectionStatus, // OK TODO TEST
  [Types.FORCE_CONNECTED_STATUS]: forceConnectedStatus, // OK TODO TEST
  [Types.GET_MIN_APP_VERSION_SUCCESS]: getMinAppVersionSuccess,
  [Types.GET_INIT_VARIABLES_REQUEST]: getInitVariablesRequest,
  [Types.GET_INIT_VARIABLES_SUCCESS]: getInitVariablesSuccess,
  [Types.FORCE_UPDATE]: forceUpdate,
  [Types.STARTUP_FAILURE]: failure,
});
