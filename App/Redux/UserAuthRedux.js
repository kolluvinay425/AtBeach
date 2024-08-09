import {createActions, createReducer} from 'reduxsauce';
import R from 'ramda';

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  isOnBoardingViewed: false,
  locale: null,
  login: {
    isFetching: false,
    isEmail: false,
    error: false,
    isLogged: false,
  },
  details: {},
  geolocation: {
    coords: {},
  },
};

const {Types, Creators} = createActions({
  setOnBoardingViewed: null,
  createAccountRequest: ['data', 'callback'],
  updateAccountRequest: ['data'],
  loginRequestEmail: ['data', 'callback'],
  loginReset: '',
  loginRequestFb: ['callback'],
  loginRequestApple: ['callback'],
  loginSuccess: ['data'],
  loginFailure: ['error'],
  logout: null,
  setUserLocation: ['info'],
  setLocalization: ['locale', 'restart'],
});

export const UserAuthTypes = Types;
export default Creators;

/* ------------- Reducers ------------- */

const setOnBoardingViewed = (state: Object) =>
  R.evolve(
    {
      isOnBoardingViewed: R.T,
    },
    state,
  );

const loginRequest = (state: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.T,
        isEmail: R.T,
        error: R.F,
        isLogged: R.F,
      },
      details: () => {},
    },
    state,
  );

const createAccountRequest = (state: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.T,
        isEmail: R.T,
        error: R.F,
        isLogged: R.F,
      },
    },
    state,
  );

const updateAccountRequest = (state: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.T,
        isEmail: R.T,
        error: R.F,
      },
    },
    state,
  );

const loginReset = (state: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.F,
        error: R.F,
      },
    },
    state,
  );

// we've successfully logged in
const loginSuccess = (state: Object, action: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.F,
        isEmail: R.F,
        error: R.F,
        isLogged: R.T,
      },
      details: () => action.data,
    },
    state,
  );

// we've had a problem logging in
const loginFailure = (state: Object, {error}: Object) =>
  R.evolve(
    {
      login: {
        isFetching: R.F,
        isEmail: R.T,
        isLogged: R.F,
        error: () => error,
      },
      details: () => {},
    },
    state,
  );

const logout = (state: Object, {error}: Object) =>
  R.evolve(
    {
      isOnBoardingViewed: R.F,
      login: {
        isFetching: R.F,
        isEmail: R.F,
        isLogged: R.F,
        error: R.F,
      },
      details: () => {},
    },
    state,
  );

const setUserLocation = (state: Object, action: Object) => {
  return R.evolve(
    {
      geolocation: {
        coords: () => action.info,
      },
    },
    state,
  );
};

const setLocalization = (state: Object, action: Object) =>
  R.set(R.lensPath(['locale']), action.locale, state);

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ON_BOARDING_VIEWED]: setOnBoardingViewed, // OK
  [Types.LOGIN_RESET]: loginReset,
  [Types.LOGIN_REQUEST_EMAIL]: loginRequest, // OK
  [Types.CREATE_ACCOUNT_REQUEST]: createAccountRequest, // OK
  [Types.UPDATE_ACCOUNT_REQUEST]: updateAccountRequest, // OK
  [Types.LOGIN_REQUEST_FB]: loginRequest,
  [Types.LOGIN_REQUEST_APPLE]: loginRequest,
  [Types.LOGIN_SUCCESS]: loginSuccess, // OK
  [Types.LOGIN_FAILURE]: loginFailure, // OK
  [Types.LOGOUT]: logout, // OK
  [Types.SET_USER_LOCATION]: setUserLocation, // OK
  [Types.SET_LOCALIZATION]: setLocalization, // OK
});
