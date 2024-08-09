// @flow

import { createActions, createReducer } from "reduxsauce";
import { NavigationActions } from "react-navigation";
import R from "ramda";
import {
  addMarkerRedraw,
  getGpsPointsDistance,
  getNearestSpot,
  redrawMarkers,
} from "../Lib/MapService";
import { SEARCH_INDEX } from "../Lib/TextSearch";
import { Text, View } from "react-native";
import Salesman from "../Lib/salesman.js";
import React from "react";
import { sortFirstArrayBySecondArray } from "../Lib/Utilities";
import { convexHull } from "../Lib/salesman2";
import { decrypt, encrypt } from "../Lib/Crypt";
/* ------------- Types and Action Creators ------------- */
// Importing createActions from reduxsauce to create action types and action creators
const { Types, Creators } = createActions({
  // Actions related to map centering
  setMapNeedsCentering: null, // Action to indicate the map needs to be centered
  unsetMapNeedsCentering: null, // Action to indicate the map does not need to be centered

  // Actions related to fetching all beach spots
  getAllBeachSpotsRequest: null, // Action to request fetching all beach spots
  getAllBeachSpotsFailure: ["error"], // Action dispatched when fetching all beach spots fails, contains error info
  getAllBeachSpotsSuccess: ["data"], // Action dispatched when fetching all beach spots succeeds, contains data

  // Actions related to searching beach spots
  searchBeachSpotsRequest: null, // Action to request searching beach spots
  searchBeachSpotsFailure: ["error"], // Action dispatched when searching beach spots fails, contains error info
  searchBeachSpotsSuccess: ["data"], // Action dispatched when searching beach spots succeeds, contains data

  // Action to set search filters as active
  setSearchFiltersActive: ["data", "performSearch"], // Action to set search filters active, optionally perform search

  // Actions related to fetching a specific beach spot
  getBeachSpotRequest: ["id"], // Action to request fetching a specific beach spot by id
  getBeachSpotFailure: ["error"], // Action dispatched when fetching a specific beach spot fails, contains error info
  getBeachSpotSuccess: ["data"], // Action dispatched when fetching a specific beach spot succeeds, contains data

  // Actions related to fetching nearby beach spots
  getNearbyBeachSpotsRequest: ["params"], // Action to request fetching nearby beach spots with certain parameters
  getNearbyBeachSpotsFailure: ["error"], // Action dispatched when fetching nearby beach spots fails, contains error info
  getNearbyBeachSpotsSuccess: ["data"], // Action dispatched when fetching nearby beach spots succeeds, contains data

  // Actions related to changing beach spot state
  changeBeachSpotStateRequest: ["params"], // Action to request changing the state of a beach spot with parameters
  changeBeachSpotStateFailure: ["error"], // Action dispatched when changing beach spot state fails, contains error info
  changeBeachSpotStateSuccess: ["data"], // Action dispatched when changing beach spot state succeeds, contains data

  // Actions related to reporting beach spot state
  reportBeachSpotStateRequest: ["params"], // Action to request reporting the state of a beach spot with parameters
  reportBeachSpotStateFailure: ["error"], // Action dispatched when reporting beach spot state fails, contains error info
  reportBeachSpotStateSuccess: ["data"], // Action dispatched when reporting beach spot state succeeds, contains data

  // Actions related to fetching the latest reports
  getLatestReportsRequest: ["params"], // Action to request fetching the latest reports with parameters
  getLatestReportsFailure: ["error"], // Action dispatched when fetching the latest reports fails, contains error info
  getLatestReportsSuccess: ["data"], // Action dispatched when fetching the latest reports succeeds, contains data

  // Action to set a specific pin as active on the map
  setPinActive: ["id"], // Action to set a pin active by id

  // Action to trigger a redraw of the markers on the map
  fireRedrawMarkers: ["data"], // Action to trigger marker redraw with provided data

  // Actions related to managing beach spot favorites
  addBeachSpotFavorite: ["id"], // Action to add a beach spot to favorites by id
  removeBeachSpotFavorite: ["id"], // Action to remove a beach spot from favorites by id

  // Action to update the visibility of beach spots
  updateBeachSpotsVisible: ["resetAll"], // Action to update visibility, with option to reset all

  // Actions to set and unset filter for hiding full beach spots
  setFilterHideFull: null, // Action to set filter to hide full beach spots
  unsetFilterHideFull: null, // Action to unset filter to hide full beach spots

  // Action to set the map center
  setMapCenter: ["center"], // Action to set the map center with provided coordinates

  // Actions to set and unset filter to show only beach spots owned by a specific owner
  setFilterOnlyOwned: ["ownerId"], // Action to set filter to show only beach spots owned by the provided owner ID
  unsetFilterOnlyOwned: null, // Action to unset filter to show only owned beach spots

  // Action to update a specific beach spot's data
  updateBeachSpot: ["data"], // Action to update a beach spot's data with provided data

  // Actions related to fetching weather forecasts for a beach spot
  getWeatherForecastsRequest: ["beachSpotId"], // Action to request fetching weather forecasts for a specific beach spot by ID
  getWeatherForecastsFailure: ["error"], // Action dispatched when fetching weather forecasts fails, contains error info
  getWeatherForecastsSuccess: ["data"], // Action dispatched when fetching weather forecasts succeeds, contains data

  // Actions related to managing order packages
  getOrderPackagesRequest: ["params"], // Action to request fetching order packages with parameters
  getOrderPackagesFailure: ["error"], // Action dispatched when fetching order packages fails, contains error info
  getOrderPackagesSuccess: ["data"], // Action dispatched when fetching order packages succeeds, contains data

  // Actions related to managing order locks
  getOrderLockRequest: ["params", "callbackSuccess", "callbackFailure"], // Action to request locking an order with parameters, success, and failure callbacks
  getOrderLockFailure: ["error"], // Action dispatched when order lock fails, contains error info
  getOrderLockSuccess: ["data"], // Action dispatched when order lock succeeds, contains data

  // Actions related to managing order payment intents
  getOrderPaymentIntentRequest: ["params", "callback"], // Action to request creating a payment intent with parameters and callback
  getOrderPaymentIntentFailure: ["error"], // Action dispatched when creating payment intent fails, contains error info
  getOrderPaymentIntentSuccess: ["data"], // Action dispatched when creating payment intent succeeds, contains data

  // Actions related to managing order payment confirmations
  getOrderPaymentConfirmRequest: ["params", "callback"], // Action to request confirming a payment with parameters and callback
  getOrderPaymentConfirmFailure: ["error"], // Action dispatched when payment confirmation fails, contains error info
  getOrderPaymentConfirmSuccess: ["data"], // Action dispatched when payment confirmation succeeds, contains data

  // Actions related to fetching placement status
  getPlacementsStatusRequest: ["params"], // Action to request fetching placement status with parameters
  getPlacementsStatusFailure: ["error"], // Action dispatched when fetching placement status fails, contains error info
  getPlacementsStatusSuccess: ["data"], // Action dispatched when fetching placement status succeeds, contains data
});

// Exporting the created action types and action creators
export const BeachSpotsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  map: {
    needsCentering: false,
  },
  all: {
    isFetching: false,
    error: false,
    data: [],
  },
  nearby: {
    isFetching: false,
    error: false,
    data: [],
  },
  current: {
    isFetching: false,
    error: false,
    data: {},
    placementsStatus: {
      isFetching: false,
      error: false,
      data: {},
    },
  },
  order: {
    packages: {
      isFetching: false,
      error: false,
      data: [],
    },
    lock: {
      isFetching: false,
      error: false,
      data: {},
    },
    paymentIntent: {
      isFetching: false,
      error: false,
      data: {},
    },
    paymentConfirm: {
      isFetching: false,
      error: false,
      data: {},
    },
  },
  filtered: {
    searchFiltersActive: [],
    hideFull: false,
    onlyOwnedBy: null,
    mapCenter: {},
    data: [],
  },
  favorites: [],
  stateChange: {
    isFetching: false,
    error: false,
  },
  reportChange: {
    isFetching: false,
    error: false,
  },
  latestReports: {
    isFetching: false,
    error: false,
    data: [],
  },
  weatherForecasts: {
    isFetching: false,
    error: false,
    data: null,
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
    state
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
    state
  );
};

const searchRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      all: {
        isFetching: R.T,
      },
    },
    state
  );
};
const searchFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      all: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};

// const orderingLeftRight = (a, b) => {
//   const latitudeDistance = Math.abs(a.latitude - b.latitude)
//   console.log(latitudeDistance)
//   if (latitudeDistance < 0.01) {
//     console.log('HERE')
//     return -(a.longitude - b.longitude)
//   } else {
//     console.log('----')
//     return -((a.longitude - b.longitude)*1000)
//   }
// }

const getRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        isFetching: R.T,
        data: () => {},
      },
    },
    state
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
    state
  );
};

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const longitudeOrdering = (a, b) => {
  // console.log(a,b)
  // const longDiff = a.longitude - b.longitude
  // const latDiff = a.latitude - b.latitude

  const x = a.latitude / a.longitude;
  const y = b.latitude / b.longitude;
  return x - y;

  // const distance = getGpsPointsDistance(a.latitude, a.longitude, b.latitude, b.longitude)
  //
  // console.log('------')
  // console.log(a)
  // console.log(b)
  // console.log(distance)
  // console.log('------')
  //
  // return distance

  // return longDiff // - latDiff// longDiff < latDiff ? longDiff - latDiff : latDiff - longDiff// latDiff ? longDiff : latDiff
};

const customPointOrdering = (beachSpots) => {
  let firstBeachSpot = beachSpots[0];
  for (const bs of beachSpots) {
    if (
      bs.longitude / bs.latitude <
      firstBeachSpot.longitude / firstBeachSpot.latitude
    ) {
      firstBeachSpot = bs;
    }
  }

  const path = [firstBeachSpot];
  const firstIndex = beachSpots.indexOf(firstBeachSpot);

  // console.log(firstIndex)

  beachSpots.splice(firstIndex, 1);

  // console.log(path)
  // console.log(beachSpots.length)

  for (let i = beachSpots.length - 1; i > -1; i--) {
    const closestSpotIndex = getNearestSpot(
      beachSpots,
      [path[path.length - 1].latitude, path[path.length - 1].longitude],
      true
    );
    // console.log(closestSpotIndex)

    path.push(beachSpots[closestSpotIndex]);
    beachSpots.splice(closestSpotIndex, 1);
  }

  return path;
};

const getAllSuccess = (state: Object, action: Object) => {
  if (action.data) {
    // encrypt('test', action.data.iv).then((data) => {
    //   console.log('enc', data)
    // })

    // const parsed = JSON.parse(action.data)
    // const payload = JSON.parse(action.data)

    // JUST IN CASE WE ARE IN THE ENCR OR DECR
    let decrypted_data = {};

    if (action.data?.beach_spots) {
      decrypted_data.beach_spots = action.data.beach_spots;
    } else {
      decrypted_data = JSON.parse(decrypt(action.data.data, action.data.iv));
    }

    if (decrypted_data.beach_spots) {
      const grouped_data = groupBy(
        decrypted_data.beach_spots,
        (beach_spot) => beach_spot.sea_id
      );

      let data = [];
      grouped_data.forEach((data_group) => {
        const data_group_ordered = customPointOrdering(data_group);
        // data = data.concat(data_group.sort(longitudeOrdering))
        // data = data.concat(convexHull(data_group))

        data = data.concat(data_group_ordered);

        // console.log("DATA GROUP", data_group)
        // const data_group_order = Salesman.solve(data_group, 0.7)
        // console.log('ORDER', data_group_order)
        // const data_group_ordered = data_group_order.map(i => data_group[i]);
        // console.log('ORDERED', data_group_ordered)
        //
      });

      // action.data.beach_spots.sort(latitudeOrdering);

      state.favorites.forEach((id) => {
        const beachSpot = data.find((bs) => bs.id === id);
        if (beachSpot) {
          beachSpot.isFavorite = true;
        }
      });

      const beachSpotActiveId = state.all.data.find(
        (beachSpot) => beachSpot.isActive
      )?.id;

      data.forEach((beachSpot) => {
        // beachSpot.latitude = parseFloat(beachSpot.latitude)
        // beachSpot.longitude = parseFloat(beachSpot.longitude)

        if (beachSpot.id === beachSpotActiveId) {
          beachSpot.isActive = true;
        } else {
          beachSpot.isActive = false;
        }

        SEARCH_INDEX.add(
          beachSpot.id,
          `${beachSpot.name} ${beachSpot.locality} ${beachSpot.city.name}`
        );
      });

      return R.evolve(
        {
          all: {
            isFetching: R.F,
            error: R.F,
            data: () => data,
          },
        },
        state
      );
    }
  }

  return state;
};

const searchSuccess = (state: Object, action: Object) => {
  if (action.data) {
    let decrypted_data = {};

    if (action.data?.beach_spots) {
      decrypted_data.beach_spots = action.data.beach_spots;
    } else {
      decrypted_data = JSON.parse(decrypt(action.data.data, action.data.iv));
    }

    if (decrypted_data.beach_spots) {
      const newBeachSpots = Object.assign([], state.all.data);
      // const newBeachSpots = R.clone(state.all.data)

      newBeachSpots.forEach((beach_spot, index) => {
        if (decrypted_data.beach_spots.includes(beach_spot.id)) {
          newBeachSpots[index].isVisible = true;
        } else {
          newBeachSpots[index].isVisible = false;
        }
      });

      return R.evolve(
        {
          all: {
            error: R.F,
            data: () => newBeachSpots,
          },
        },
        state
      );
    }
  }

  return state;
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
      state
    );
  }

  return state;
};

const getNearbyRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      nearby: {
        isFetching: R.T,
      },
    },
    state
  );
};
const getNearbyFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      nearby: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};
const getNearbySuccess = (state: Object, action: Object) => {
  // const data = action.data.sort((a, b) => {return -(a.latitude - b.latitude)});
  return R.evolve(
    {
      nearby: {
        isFetching: R.F,
        error: R.F,
        data: () => action.data.beach_spots,
      },
    },
    state
  );
};

const changeBeachSpotStateRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      stateChange: {
        isFetching: R.T,
        error: R.F,
      },
    },
    state
  );
};
const changeBeachSpotStateFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      stateChange: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};
const changeBeachSpotStateSuccess = (state: Object, action: Object) => {
  const newState = R.evolve(
    {
      stateChange: {
        isFetching: R.F,
        error: R.F,
      },
    },
    state
  );

  let index = newState.all.data.findIndex(
    (beachSpot) => beachSpot.id === action.data.beach_spot.id
  );
  if (index > -1) {
    action.data.beach_spot.isActive = true;
    action.data.beach_spot.isVisible = true;
    newState.all.data[index] = action.data.beach_spot;
  }

  if (newState.current.data.id == action.data.beach_spot.id) {
    newState.current.data = action.data.beach_spot;
  }

  // index = newState.nearby.data.findIndex((beachSpot) => beachSpot.id === action.data.beach_spot.id)
  // if (index > -1){
  //   newState.nearby.data[index] = action.data.beach_spot
  // }

  return newState;
};

const reportBeachSpotStateRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      reportChange: {
        isFetching: R.T,
        error: R.F,
      },
    },
    state
  );
};
const reportBeachSpotStateFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      reportChange: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};
const reportBeachSpotStateSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      reportChange: {
        isFetching: R.F,
        error: () => {
          return !action.data.saved;
        },
      },
    },
    state
  );
};

const getLatestReportsRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      latestReports: {
        isFetching: R.T,
        error: R.F,
      },
    },
    state
  );
};
const getLatestReportsFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      latestReports: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};
const getLatestReportsSuccess = (state: Object, action: Object) => {
  let spotReports = Object.entries(action.data.spot_reports).map(
    ([key, value]) => {
      const beachSpotElement = state.all.data.find(
        (beachSpot) => beachSpot.id == key
      );
      if (beachSpotElement) {
        return value.sort((a, b) => {
          return b.count - a.count;
        });
      }
    }
  );

  spotReports = spotReports.filter(function (el) {
    return el != null;
  });

  spotReports = spotReports.sort((a, b) => {
    return b[0].count - a[0].count;
  });

  return R.evolve(
    {
      latestReports: {
        isFetching: R.F,
        error: R.F,
        data: () => spotReports,
      },
    },
    state
  );
};

const setPinActive = (state: Object, action: Object) => {
  const index = state.all.data.findIndex(
    (beachSpot) => beachSpot.id === action.id
  );
  if (index > -1) {
    const newstate = R.set(
      R.lensPath(["all", "data", index, "isActive"]),
      true,
      state
    );
    addMarkerRedraw(state.all.data[index].id);

    newstate.all.data.forEach((marker) => {
      if (marker.isActive && marker.id != action.id) {
        marker.isActive = false;
        addMarkerRedraw(marker.id);
      }
    });

    return newstate;
  } else {
    return state;
  }
};

const fireRedrawMarkers = (state: Object, action: Object) => {
  if (action.data === "all") {
    redrawMarkers("all");
  } else {
    redrawMarkers();
  }

  return state;
};

const addBeachSpotFavorite = (state: Object, action: Object) => {
  const index = state.all.data.findIndex(
    (beachSpot) => beachSpot.id === action.id
  );

  const newstate = R.set(
    R.lensPath(["all", "data", index, "isFavorite"]),
    true,
    state
  );

  newstate.favorites.push(action.id);
  newstate.favorites = [...new Set(newstate.favorites)];

  return newstate;
};
const removeBeachSpotFavorite = (state: Object, action: Object) => {
  const index = state.all.data.findIndex(
    (beachSpot) => beachSpot.id === action.id
  );
  const newstate = R.set(
    R.lensPath(["all", "data", index, "isFavorite"]),
    false,
    state
  );

  const favoritesNew = newstate.favorites.filter((item) => item !== action.id);
  newstate.favorites = [...new Set(favoritesNew)];

  return newstate;
};

const updateBeachSpotsVisible = (state: Object, action: Object, args) => {
  // let newData = R.clone(state.all.data)
  let newData = Object.assign([], state.all.data);

  if (state.all && state.all.data) {
    newData = newData.map((beachSpot) => {
      if (action.resetAll) {
        beachSpot.isVisible = true;
      }
      beachSpot.isOutOfScreen = false;

      if (!beachSpot.isActive) {
        // ALWAYS SHOW ACTIVE MARKER?
        if (state.filtered.mapCenter) {
          if (
            !(
              state.filtered.mapCenter.latitude -
                state.filtered.mapCenter.latitudeDelta <
                beachSpot.latitude &&
              state.filtered.mapCenter.latitude -
                state.filtered.mapCenter.latitudeDelta / 2 +
                state.filtered.mapCenter.latitudeDelta * 2 >
                beachSpot.latitude &&
              state.filtered.mapCenter.longitude -
                state.filtered.mapCenter.longitudeDelta <
                beachSpot.longitude &&
              state.filtered.mapCenter.longitude -
                state.filtered.mapCenter.longitudeDelta / 2 +
                state.filtered.mapCenter.longitudeDelta * 2 >
                beachSpot.longitude
            )
          ) {
            beachSpot.isOutOfScreen = true;
          }
        }

        if (!beachSpot.isOutOfScreen) {
          if (
            state.filtered.hideFull &&
            (beachSpot.last_spot_state.beach_state_id === 3 ||
              beachSpot.last_spot_state.beach_state_id === 4)
          ) {
            beachSpot.isVisible = false;
          } else if (
            state.filtered.onlyOwnedBy &&
            state.filtered.onlyOwnedBy !== beachSpot.owner.id
          ) {
            beachSpot.isVisible = false;
          }
        }
      }

      return beachSpot;
    });
  }

  return {
    ...state,
    all: {
      ...state.all,
      data: newData,
      isFetching: false,
    },
  };
};

const setMapCenter = (state: Object, action: Object) => {
  return R.evolve(
    {
      filtered: {
        mapCenter: () => action.center,
      },
    },
    state
  );
};

const setFilterHideFull = (state: Object, action: Object) => {
  return R.evolve(
    {
      filtered: {
        hideFull: R.T,
      },
    },
    state
  );
};
const unsetFilterHideFull = (state: Object, action: Object) => {
  return R.evolve(
    {
      filtered: {
        hideFull: R.F,
      },
    },
    state
  );
};

const setFilterOnlyOwned = (state: Object, action: Object) => {
  return R.evolve(
    {
      filtered: {
        onlyOwnedBy: () => action.ownerId,
      },
    },
    state
  );
};
const unsetFilterOnlyOwned = (state: Object, action: Object) => {
  return R.evolve(
    {
      filtered: {
        onlyOwnedBy: () => null,
      },
    },
    state
  );
};

const updateBeachSpot = (state: Object, action: Object) => {
  if (state.all && state.all.data) {
    const index = state.all.data.findIndex(
      (element) => element.id === action.data.beach_spot.id
    );
    if (index > -1) {
      return R.set(
        R.lensPath(["all", "data", index]),
        action.data.beach_spot,
        state
      );
    }
  }

  return state;
};

const getWeatherForecastsRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      weatherForecasts: {
        isFetching: R.T,
      },
    },
    state
  );
};
const getWeatherForecastsFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      weatherForecasts: {
        isFetching: R.F,
        error: R.T,
      },
    },
    state
  );
};
const getWeatherForecastsSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      weatherForecasts: {
        isFetching: R.F,
        error: R.F,
        data: () => action.data,
      },
    },
    state
  );
};

const getOrderPackagesRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        packages: {
          isFetching: R.T,
        },
      },
    },
    state
  );
};
const getOrderPackagesFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        packages: {
          isFetching: R.F,
          error: R.T,
        },
      },
    },
    state
  );
};
const getOrderPackagesSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        packages: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
    },
    state
  );
};

const getOrderLockRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        lock: {
          isFetching: R.T,
          error: R.F,
        },
      },
    },
    state
  );
};
const getOrderLockFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        lock: {
          isFetching: R.F,
          error: R.T,
        },
      },
    },
    state
  );
};
const getOrderLockSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        lock: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
    },
    state
  );
};

const getOrderPaymentIntentRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentIntent: {
          isFetching: R.T,
        },
      },
    },
    state
  );
};
const getOrderPaymentIntentFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentIntent: {
          isFetching: R.F,
          error: R.T,
        },
      },
    },
    state
  );
};
const getOrderPaymentIntentSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentIntent: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
    },
    state
  );
};

const getOrderPaymentConfirmRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentConfirm: {
          isFetching: R.T,
        },
      },
    },
    state
  );
};
const getOrderPaymentConfirmFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentConfirm: {
          isFetching: R.F,
          error: R.T,
        },
      },
    },
    state
  );
};
const getOrderPaymentConfirmSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      order: {
        paymentConfirm: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
    },
    state
  );
};

const setSearchFiltersActive = (state: Object, action: Object) => {
  const public_i = action.data.indexOf(68); //public
  const private_i = action.data.indexOf(69); //private
  if (public_i > -1 && private_i > -1) {
    if (public_i < private_i) {
      action.data.splice(public_i, 1);
    } else {
      action.data.splice(private_i, 1);
    }
  }
  const sea_calm_i = action.data.indexOf(71); //calm
  const sea_wave_i = action.data.indexOf(72); //waves
  if (sea_calm_i > -1 && sea_wave_i > -1) {
    if (sea_calm_i < sea_wave_i) {
      action.data.splice(sea_calm_i, 1);
    } else {
      action.data.splice(sea_wave_i, 1);
    }
  }

  return R.evolve(
    {
      filtered: {
        searchFiltersActive: () => action.data,
      },
    },
    state
  );
};

const getPlacementsStatusRequest = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        placementsStatus: {
          isFetching: R.T,
          error: R.F,
        },
      },
    },
    state
  );
};
const getPlacementsStatusFailure = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        placementsStatus: {
          isFetching: R.F,
          error: R.T,
        },
      },
    },
    state
  );
};
const getPlacementsStatusSuccess = (state: Object, action: Object) => {
  return R.evolve(
    {
      current: {
        placementsStatus: {
          isFetching: R.F,
          error: R.F,
          data: () => action.data,
        },
      },
    },
    state
  );
};

const setMapNeedsCentering = (state) => {
  return R.evolve(
    {
      map: {
        needsCentering: R.T,
      },
    },
    state
  );
};
const unsetMapNeedsCentering = (state) => {
  return R.evolve(
    {
      map: {
        needsCentering: R.F,
      },
    },
    state
  );
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_MAP_NEEDS_CENTERING]: setMapNeedsCentering,
  [Types.UNSET_MAP_NEEDS_CENTERING]: unsetMapNeedsCentering,
  [Types.GET_ALL_BEACH_SPOTS_REQUEST]: getAllRequest,
  [Types.GET_ALL_BEACH_SPOTS_FAILURE]: getAllFailure,
  [Types.GET_ALL_BEACH_SPOTS_SUCCESS]: getAllSuccess,
  [Types.SEARCH_BEACH_SPOTS_REQUEST]: searchRequest,
  [Types.SEARCH_BEACH_SPOTS_FAILURE]: searchFailure,
  [Types.SEARCH_BEACH_SPOTS_SUCCESS]: searchSuccess,
  [Types.SET_SEARCH_FILTERS_ACTIVE]: setSearchFiltersActive,
  [Types.GET_BEACH_SPOT_REQUEST]: getRequest,
  [Types.GET_BEACH_SPOT_FAILURE]: getFailure,
  [Types.GET_BEACH_SPOT_SUCCESS]: getSuccess,
  [Types.GET_NEARBY_BEACH_SPOTS_REQUEST]: getNearbyRequest,
  [Types.GET_NEARBY_BEACH_SPOTS_FAILURE]: getNearbyFailure,
  [Types.GET_NEARBY_BEACH_SPOTS_SUCCESS]: getNearbySuccess,
  [Types.CHANGE_BEACH_SPOT_STATE_REQUEST]: changeBeachSpotStateRequest,
  [Types.CHANGE_BEACH_SPOT_STATE_FAILURE]: changeBeachSpotStateFailure,
  [Types.CHANGE_BEACH_SPOT_STATE_SUCCESS]: changeBeachSpotStateSuccess,
  [Types.REPORT_BEACH_SPOT_STATE_REQUEST]: reportBeachSpotStateRequest,
  [Types.REPORT_BEACH_SPOT_STATE_FAILURE]: reportBeachSpotStateFailure,
  [Types.REPORT_BEACH_SPOT_STATE_SUCCESS]: reportBeachSpotStateSuccess,
  [Types.GET_LATEST_REPORTS_REQUEST]: getLatestReportsRequest,
  [Types.GET_LATEST_REPORTS_FAILURE]: getLatestReportsFailure,
  [Types.GET_LATEST_REPORTS_SUCCESS]: getLatestReportsSuccess,
  [Types.ADD_BEACH_SPOT_FAVORITE]: addBeachSpotFavorite,
  [Types.REMOVE_BEACH_SPOT_FAVORITE]: removeBeachSpotFavorite,
  [Types.SET_PIN_ACTIVE]: setPinActive,
  [Types.FIRE_REDRAW_MARKERS]: fireRedrawMarkers,
  [Types.UPDATE_BEACH_SPOTS_VISIBLE]: updateBeachSpotsVisible,
  [Types.SET_FILTER_HIDE_FULL]: setFilterHideFull,
  [Types.UNSET_FILTER_HIDE_FULL]: unsetFilterHideFull,
  [Types.SET_MAP_CENTER]: setMapCenter,
  [Types.SET_FILTER_ONLY_OWNED]: setFilterOnlyOwned,
  [Types.UNSET_FILTER_ONLY_OWNED]: unsetFilterOnlyOwned,
  [Types.UPDATE_BEACH_SPOT]: updateBeachSpot,
  [Types.GET_WEATHER_FORECASTS_REQUEST]: getWeatherForecastsRequest,
  [Types.GET_WEATHER_FORECASTS_FAILURE]: getWeatherForecastsFailure,
  [Types.GET_WEATHER_FORECASTS_SUCCESS]: getWeatherForecastsSuccess,
  [Types.GET_ORDER_PACKAGES_REQUEST]: getOrderPackagesRequest,
  [Types.GET_ORDER_PACKAGES_FAILURE]: getOrderPackagesFailure,
  [Types.GET_ORDER_PACKAGES_SUCCESS]: getOrderPackagesSuccess,
  [Types.GET_ORDER_LOCK_REQUEST]: getOrderLockRequest,
  [Types.GET_ORDER_LOCK_FAILURE]: getOrderLockFailure,
  [Types.GET_ORDER_LOCK_SUCCESS]: getOrderLockSuccess,
  [Types.GET_ORDER_PAYMENT_INTENT_REQUEST]: getOrderPaymentIntentRequest,
  [Types.GET_ORDER_PAYMENT_INTENT_FAILURE]: getOrderPaymentIntentFailure,
  [Types.GET_ORDER_PAYMENT_INTENT_SUCCESS]: getOrderPaymentIntentSuccess,
  [Types.GET_ORDER_PAYMENT_CONFIRM_REQUEST]: getOrderPaymentConfirmRequest,
  [Types.GET_ORDER_PAYMENT_CONFIRM_FAILURE]: getOrderPaymentConfirmFailure,
  [Types.GET_ORDER_PAYMENT_CONFIRM_SUCCESS]: getOrderPaymentConfirmSuccess,
  [Types.GET_PLACEMENTS_STATUS_REQUEST]: getPlacementsStatusRequest,
  [Types.GET_PLACEMENTS_STATUS_FAILURE]: getPlacementsStatusFailure,
  [Types.GET_PLACEMENTS_STATUS_SUCCESS]: getPlacementsStatusSuccess,
});
