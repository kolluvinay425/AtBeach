import {call, put, select} from 'redux-saga/effects';
import 'moment/locale/it';
import 'moment/locale/es';

import OrdersActions from '../Redux/OrderRedux';

export function* getAllOrders(api) {
  const response = yield call(api.getAllOrders);
  if (response.ok) {
    yield put(OrdersActions.getAllOrdersSuccess(response.data));
  } else {
    yield put(OrdersActions.getAllOrdersFailure(response.status));
  }
}

export function* getOrder(api, action) {
  const response = yield call(api.getOrder, action.id);
  if (response.ok) {
    yield put(OrdersActions.getOrderSuccess(response.data));
  } else {
    yield put(OrdersActions.getOrderFailure(response.status));
  }
}