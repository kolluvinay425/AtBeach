import {all, takeEvery, takeLatest} from 'redux-saga/effects';

import API from '../Services/Api';
import {StartupTypes} from '../Redux/StartupRedux';
import {BeachSpotsTypes} from '../Redux/BeachSpotRedux';
import {OrdersTypes} from '../Redux/OrderRedux';
/* ------------- Explore ------------- */
import {
  getAllBeachSpots,
  searchBeachSpots,
  getBeachSpot,
  setSearchFiltersActive,
  getNearbyBeachSpots,
  changeBeachSpotStateRequest,
  reportBeachSpotStateRequest,
  setPinActive,
  setFilterHideFull,
  unsetFilterHideFull,
  setMapCenter,
  setFilterOnlyOwned,
  unsetFilterOnlyOwned,
  getLatestReportsRequest,
  getWeatherForecastsRequest,
  getOrderPackagesRequest,
  getOrderLockRequest, getOrderPaymentIntentRequest, getOrderPaymentConfirmRequest, getPlacementsStatusRequest,
} from './BeachSpotsSagas';
import {getInitialVariables, startup} from './StartupSagas';
import {
  loginWithEmail,
  logout,
  setLocalization,
  loginWithFacebook,
  loginWithApple,
  createAccount,
  updateAccount,
} from './UserAuthSagas';
import {UserAuthTypes} from '../Redux/UserAuthRedux';
import {getAllOrders, getOrder} from './OrdersSagas';

/* ------------- Types ------------- */

/* ------------- Sagas ------------- */
/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    //  STARTUP
    takeLatest(StartupTypes.STARTUP, startup, api),
    takeLatest(
      StartupTypes.GET_INIT_VARIABLES_REQUEST,
      getInitialVariables,
      api,
    ),

    // LOGIN
    takeLatest(UserAuthTypes.LOGIN_REQUEST_EMAIL, loginWithEmail, api),
    takeLatest(UserAuthTypes.CREATE_ACCOUNT_REQUEST, createAccount, api),
    takeLatest(UserAuthTypes.UPDATE_ACCOUNT_REQUEST, updateAccount, api),
    takeLatest(UserAuthTypes.LOGIN_REQUEST_FB, loginWithFacebook, api),
    takeLatest(UserAuthTypes.LOGIN_REQUEST_APPLE, loginWithApple, api),
    takeLatest(UserAuthTypes.LOGOUT, logout, api),
    takeLatest(UserAuthTypes.SET_LOCALIZATION, setLocalization),
    // takeLatest(UserAuthTypes.LOGIN_FAILURE, logout, api),

    // BEACH SPOTS
    takeLatest(
      BeachSpotsTypes.GET_ALL_BEACH_SPOTS_REQUEST,
      getAllBeachSpots,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.SEARCH_BEACH_SPOTS_REQUEST,
      searchBeachSpots,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.SET_SEARCH_FILTERS_ACTIVE,
      setSearchFiltersActive
    ),
    takeLatest(BeachSpotsTypes.GET_BEACH_SPOT_REQUEST, getBeachSpot, api),
    // BEACH SPOT WEATHER FORECASTS
    takeLatest(
      BeachSpotsTypes.GET_WEATHER_FORECASTS_REQUEST,
      getWeatherForecastsRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_PLACEMENTS_STATUS_REQUEST,
      getPlacementsStatusRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_ORDER_PACKAGES_REQUEST,
      getOrderPackagesRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_ORDER_LOCK_REQUEST,
      getOrderLockRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_ORDER_PAYMENT_INTENT_REQUEST,
      getOrderPaymentIntentRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_ORDER_PAYMENT_CONFIRM_REQUEST,
      getOrderPaymentConfirmRequest,
      api,
    ),
    // BEACH SPOTS NEARBY
    takeLatest(
      BeachSpotsTypes.GET_NEARBY_BEACH_SPOTS_REQUEST,
      getNearbyBeachSpots,
      api,
    ),
    // BEACH SPOTS STATE CHANGE
    takeLatest(
      BeachSpotsTypes.CHANGE_BEACH_SPOT_STATE_REQUEST,
      changeBeachSpotStateRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.REPORT_BEACH_SPOT_STATE_REQUEST,
      reportBeachSpotStateRequest,
      api,
    ),
    takeLatest(
      BeachSpotsTypes.GET_LATEST_REPORTS_REQUEST,
      getLatestReportsRequest,
      api,
    ),
    takeLatest(BeachSpotsTypes.SET_PIN_ACTIVE, setPinActive),
    takeLatest(BeachSpotsTypes.SET_FILTER_HIDE_FULL, setFilterHideFull),
    takeLatest(BeachSpotsTypes.UNSET_FILTER_HIDE_FULL, unsetFilterHideFull),
    takeLatest(BeachSpotsTypes.SET_MAP_CENTER, setMapCenter),
    takeLatest(BeachSpotsTypes.SET_FILTER_ONLY_OWNED, setFilterOnlyOwned),
    takeLatest(BeachSpotsTypes.UNSET_FILTER_ONLY_OWNED, unsetFilterOnlyOwned),
    // ORDERS
    takeLatest(
      OrdersTypes.GET_ALL_ORDERS_REQUEST,
      getAllOrders,
      api,
    ),
    takeLatest(OrdersTypes.GET_ORDER_REQUEST, getOrder, api),
  ]);
}
