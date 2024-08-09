import {call, put, select} from 'redux-saga/effects';
import 'moment/locale/it';
import 'moment/locale/es';

import BeachSpotsActions from '../Redux/BeachSpotRedux';

import {addMarkerRedraw} from '../Lib/MapService';

const selectFiltersActive = state => state.beachSpots.filtered.searchFiltersActive;

export function* getAllBeachSpots(api) {
  const response = yield call(api.getAllBeachSpot);
  if (response.ok) {
    yield put(BeachSpotsActions.getAllBeachSpotsSuccess(response.data));
    yield put(BeachSpotsActions.updateBeachSpotsVisible(true));
  } else {
    yield put(BeachSpotsActions.getAllBeachSpotsFailure(response.status));
  }
}

export function* setSearchFiltersActive(params) {
  if (params.performSearch){
    yield put(BeachSpotsActions.searchBeachSpotsRequest());
  }
}

export function* searchBeachSpots(api) {
  const activeTags = yield select(selectFiltersActive)
  const params = {
    tags: activeTags ? activeTags.join(',') : ''
  }

  const response = yield call(api.searchBeachSpot, params);
  if (response.ok) {
    yield put(BeachSpotsActions.searchBeachSpotsSuccess(response.data));
    yield put(BeachSpotsActions.updateBeachSpotsVisible());
    yield put(BeachSpotsActions.setMapNeedsCentering());
  } else {
    yield put(BeachSpotsActions.searchBeachSpotsFailure(response.status));
  }
}

export function* getBeachSpot(api, action) {
  const response = yield call(api.getBeachSpot, action.id);
  if (response.ok) {
    yield put(BeachSpotsActions.getBeachSpotSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getBeachSpotFailure(response.status));
  }
}

export function* getNearbyBeachSpots(api, action) {
  // console.log(action);

  const params = {
    latitude: action.params.latitude || '',
    longitude: action.params.longitude || '',
    limit: action.params.limit || '',
    km: action.params.km || '',
    sea_id: action.params.sea_id || '',
    // around_first_beach_spot: action.params.around_first_beach_spot || '',
    spot_type: action.params.spot_type || '',
    around_beach_spot: action.params.around_beach_spot || '',

  };

  const response = yield call(api.getNearbyBeachSpot, params);
  if (response.ok) {
    yield put(BeachSpotsActions.getNearbyBeachSpotsSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getNearbyBeachSpotsFailure(response.status));
  }
}

export function* changeBeachSpotStateRequest(api, action) {
  const response = yield call(api.changeBeachSpotState, action.params);

  if (response.ok) {
    yield put(BeachSpotsActions.changeBeachSpotStateSuccess(response.data));
    yield put(BeachSpotsActions.getLatestReportsRequest());
    addMarkerRedraw(response.data.beach_spot.id);
  } else {
    yield put(BeachSpotsActions.changeBeachSpotStateFailure(response.status));
  }
}

export function* reportBeachSpotStateRequest(api, action) {
  const response = yield call(api.reportBeachSpotState, action.params);

  if (response.ok) {
    yield put(BeachSpotsActions.reportBeachSpotStateSuccess(response.data));
    yield put(BeachSpotsActions.updateBeachSpot(response.data));
    yield put(BeachSpotsActions.updateBeachSpotsVisible());
  } else {
    yield put(BeachSpotsActions.reportBeachSpotStateFailure(response.status));
  }
}

export function* getLatestReportsRequest(api, action) {
  const response = yield call(api.getLatestReports);

  if (response.ok) {
    yield put(BeachSpotsActions.getLatestReportsSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getLatestReportsFailure(response.status));
  }
}

export function* getWeatherForecastsRequest(api, action) {
  const response = yield call(api.getWeatherForecasts, action.beachSpotId);

  if (response.ok) {
    yield put(BeachSpotsActions.getWeatherForecastsSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getWeatherForecastsFailure(response.status));
  }
}

export function* getPlacementsStatusRequest(api, action) {
  const response = yield call(api.getPlacementsStatus, action.params);

  if (response.ok) {
    yield put(BeachSpotsActions.getPlacementsStatusSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getPlacementsStatusFailure(response.status));
  }
}

export function* getOrderPackagesRequest(api, action) {
  const response = yield call(api.getOrderPackages, action.params);

  if (response.ok) {
    yield put(BeachSpotsActions.getOrderPackagesSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getOrderPackagesFailure(response.status));
  }
}

export function* getOrderLockRequest(api, action) {
  const response = yield call(api.postOrderLock, action.params);
  if (response.ok) {
    yield put(BeachSpotsActions.getOrderLockSuccess(response.data));
    action.callbackSuccess();
  } else {
    yield put(BeachSpotsActions.getOrderLockFailure(response.status));
    action.callbackFailure();
  }
}

export function* getOrderPaymentIntentRequest(api, action) {
  const response = yield call(api.postOrderPaymentIntent, action.params);
  if (response.ok) {
    yield put(BeachSpotsActions.getOrderPaymentIntentSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getOrderPaymentIntentFailure(response.status));
  }
}

export function* getOrderPaymentConfirmRequest(api, action) {
  const response = yield call(api.postOrderPaymentConfirm, action.params);
  if (response.ok) {
    yield put(BeachSpotsActions.getOrderPaymentConfirmSuccess(response.data));
  } else {
    yield put(BeachSpotsActions.getOrderPaymentConfirmFailure(response.status));
  }
}

export function* setPinActive() {
  yield put(BeachSpotsActions.fireRedrawMarkers());
}

export function* setFilterHideFull() {
  yield put(BeachSpotsActions.updateBeachSpotsVisible());
}

export function* unsetFilterHideFull() {
  yield put(BeachSpotsActions.updateBeachSpotsVisible());
}

export function* setMapCenter() {
  yield put(BeachSpotsActions.updateBeachSpotsVisible());
}

export function* setFilterOnlyOwned() {
  yield put(BeachSpotsActions.updateBeachSpotsVisible());
}

export function* unsetFilterOnlyOwned() {
  yield put(BeachSpotsActions.updateBeachSpotsVisible());
}
