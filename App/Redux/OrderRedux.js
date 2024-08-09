// @flow

import {createActions, createReducer} from 'reduxsauce';
import {NavigationActions} from 'react-navigation';
import R from 'ramda';
import {
  addMarkerRedraw,
  getGpsPointsDistance,
  getNearestSpot,
  redrawMarkers,
} from '../Lib/MapService';
import {SEARCH_INDEX} from '../Lib/TextSearch';
import {Text, View} from 'react-native';
import Salesman from '../Lib/salesman.js';
import React from 'react';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getAllOrdersRequest: null,
  getAllOrdersFailure: ['error'],
  getAllOrdersSuccess: ['data'],
  getOrderRequest: ['id'],
  getOrderFailure: ['error'],
  getOrderSuccess: ['data']
});

export const OrdersTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  all: {
    isFetching: false,
    error: false,
    data: [],
  },
};

/* ------------- MULTIPLE ------------- */

const getAllRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      all: {
        isFetching: R.T,
      },
    },
    state,
  );
};
const getAllFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      all: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state,
  );
};

const getAllSuccess = (state: Object, action: Object) => {

  // if (action.data.beach_spots) {
  //   const grouped_data = groupBy(
  //     action.data.beach_spots,
  //     beach_spot => beach_spot.sea_id,
  //   );
  //
  //   // console.log(grouped_data)
  //
  //   let data = [];
  //   grouped_data.forEach(data_group => {
  //     const data_group_ordered = customPointOrdering(data_group);
  //     // data = data.concat(data_group.sort(longitudeOrdering))
  //     // data = data.concat(convexHull(data_group))
  //
  //     data = data.concat(data_group_ordered);
  //
  //     // console.log("DATA GROUP", data_group)
  //     // const data_group_order = Salesman.solve(data_group, 0.7)
  //     // console.log('ORDER', data_group_order)
  //     // const data_group_ordered = data_group_order.map(i => data_group[i]);
  //     // console.log('ORDERED', data_group_ordered)
  //     //
  //   });
  //
  //   // console.log("FINAL DATA", data)
  //
  //   // action.data.beach_spots.sort(latitudeOrdering);
  //
  //   state.favorites.forEach(id => {
  //     const beachSpot = data.find(bs => bs.id === id);
  //     if (beachSpot) {
  //       beachSpot.isFavorite = true;
  //     }
  //   });
  //
  //   const beachSpotActiveId = state.all.data.find(
  //     beachSpot => beachSpot.isActive,
  //   )?.id;
  //
  //   data.forEach(beachSpot => {
  //     // beachSpot.latitude = parseFloat(beachSpot.latitude)
  //     // beachSpot.longitude = parseFloat(beachSpot.longitude)
  //
  //     if (beachSpot.id === beachSpotActiveId) {
  //       beachSpot.isActive = true;
  //     } else {
  //       beachSpot.isActive = false;
  //     }
  //
  //     SEARCH_INDEX.add(
  //       beachSpot.id,
  //       `${beachSpot.name} ${beachSpot.locality} ${beachSpot.city.name}`,
  //     );
  //   });
  //
  //   return R.evolve(
  //     {
  //       all: {
  //         isFetching: R.F,
  //         error: R.F,
  //         data: () => data,
  //       },
  //     },
  //     state,
  //   );
  // }

  return state;
};

const getRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        isFetching: R.T,
      },
    },
    state,
  );
};
const getFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state,
  );
};


const getSuccess = (state: Object, action: Object) => {
  if (action.data) {
    return R.evolve(
      {
        current: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
      state,
    );
  }

  return state;
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ALL_ORDERS_REQUEST]: getAllRequest,
  [Types.GET_ALL_ORDERS_FAILURE]: getAllFailure,
  [Types.GET_ALL_ORDERS_SUCCESS]: getAllSuccess,
  [Types.GET_ORDER_REQUEST]: getRequest,
  [Types.GET_ORDER_FAILURE]: getFailure,
  [Types.GET_ORDER_SUCCESS]: getSuccess,
});
