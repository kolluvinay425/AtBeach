// a library to wrap and simplify api calls
import apisauce from 'apisauce';
import qs from 'qs';
import * as RNLocalize from 'react-native-localize';
import {Platform} from 'react-native';
import R, {identity} from 'ramda';
import Reactotron from '../Config/ReactotronConfig';
import * as rax from 'retry-axios';

const isIOS = Platform.OS === 'ios';
const devRemote = false;

const FORCE_LOGIN_AS = {
  // email: 'a.montrone@outlook.com',
  // token: 'kX3cLYtDw3UhJJmwKLMJ'
};

export const FORCE_GPS_AT = {
  force: true,
  accuracy: 20,
  latitude: 40.933268,
  longitude: 17.328069,
  // latitude: 40.929777,
  // longitude: 17.331046
};

const raxConfig = instance => {
  return {
    // Retry 3 times on requests that return a response (500, etc) before giving up.  Defaults to 3.
    retry: 5,

    // Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
    noResponseRetries: 2,

    // Milliseconds to delay at first.  Defaults to 100.
    retryDelay: 700,

    // HTTP methods to automatically retry.  Defaults to:
    // ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT']
    httpMethodsToRetry: ['GET', 'POST'],

    // The response status codes to retry.  Supports a double
    // array with a list of ranges.  Defaults to:
    // [[100, 199], [429, 429], [500, 599]]
    statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],

    // If you are using a non static instance of Axios you need
    // to pass that instance here (const ax = axios.create())
    instance,

    // You can detect when a retry is happening, and figure out how many
    // retry attempts have been made
    onRetryAttempt: (err: any) => {
      if (__DEV__) {
        const cfg = rax.getConfig(err);
        console.log(
          `Retry attempt #${cfg ? cfg.currentRetryAttempt : 'unknown'}`,
        );
        console.log(cfg);
      }
    },
  };
};

const create = () => {
  // const deviceLocale = RNLocalize.getLocales()[0].languageCode //DeviceInfo.getDeviceLocale().substring(0, 2);
  // const deviceRegion = RNLocalize.getCountry().toLowerCase() // DeviceInfo.getDeviceCountry().toLowerCase();
  // const fullLocale = `${deviceLocale}-${deviceRegion}`;

  const fullLocale = RNLocalize.getLocales()[0].languageTag.toLowerCase(); //DeviceInfo.getDeviceLocale().substring(0, 2);

  const HOST = __DEV__
    ? devRemote
      ? 'https://spiagge.innopa.it'
      : isIOS
      ? 'http://localhost:4000' //192.168.1.227 //localhost
      : 'http://192.168.135.113:4000' // 10.0.2.2, 10.0.3.2 - localhost:30003 - https://www.oreegano.com
    : 'https://spiagge.innopa.it';

  let baseURL = `${HOST}/api/v1/${fullLocale}/`;
  const AUTH = __DEV__ ? 'Basic dGhldXNlcjpzdXBlcnNlY3JldHBhc3N3b3Jk' : ''; // + btoa("theuser:supersecretpassword"),

  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'spiagge.innopa.app',
      Authorization: AUTH,
    },
    timeout: 10 * 1000,
  });

  rax.attach(api.axiosInstance);

  const getWithRetry = url => {
    return api.get(url, {}, {raxConfig: raxConfig(api.axiosInstance)});
  };

  const postWithRetry = (url, data) => {
    return api.post(url, data, {raxConfig: raxConfig(api.axiosInstance)});
  };

  const apiForm = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'com.oreegano.app',
      Authorization: AUTH,
    },
    timeout: 20000,
  });

  if (__DEV__) {
    api.addMonitor(Reactotron.apisauce);
    apiForm.addMonitor(Reactotron.apisauce);
  }

  const setLocale = val => {
    baseURL = `${HOST}/api/v1/${val}/`;

    api.setBaseURL(baseURL);
    apiForm.setBaseURL(baseURL);
  };

  const setAuth = (email, token) => {
    if (!R.isEmpty(FORCE_LOGIN_AS)) {
      api.setHeaders({
        XUserEmail: FORCE_LOGIN_AS.email,
        XUserToken: FORCE_LOGIN_AS.token,
      });

      apiForm.setHeaders({
        XUserEmail: FORCE_LOGIN_AS.email,
        XUserToken: FORCE_LOGIN_AS.token,
      });
    } else {
      api.setHeaders({
        XUserEmail: email,
        XUserToken: token,
      });

      apiForm.setHeaders({
        XUserEmail: email,
        XUserToken: token,
      });
    }
  };

  const removeAuth = () => {
    api.setHeaders({
      XUserEmail: '',
      XUserToken: '',
    });

    apiForm.setHeaders({
      XUserEmail: '',
      XUserToken: '',
    });
  };

  /* ------------- Orders ------------- */

  const getAllOrders = () => getWithRetry('orders/all');

  const getOrder = orderId => getWithRetry(`orders/${orderId}`);

  /* ------------- BeachSpot lists ------------- */
  const getMinAppVersion = data => api.get(`/app_utility/min_ver?platform=${data.platform}`); // GET WITHOUT RETRIES
  const getInitialVariables = () => getWithRetry('initialize/all');

  const getAllBeachSpot = () => getWithRetry('beach_spot/all');

  const searchBeachSpot = (params) => getWithRetry(`beach_spot/search?tag_ids=${params.tags}`);

  const getBeachSpot = beachSpotId => getWithRetry(`beach_spot/${beachSpotId}`);

  const getPlacementsStatus = params => {
    const {beachSpotId, startingDate, endingDate} = params;

    return getWithRetry(
      `beach_spot/${beachSpotId}/orders/placements_status?starting_date=${startingDate}&ending_date=${endingDate}`,
    );
  };

  const getOrderPackages = params => {
    const {beachSpotId, placements, startingDate, endingDate} = params;

    return getWithRetry(
      `beach_spot/${beachSpotId}/orders/package_prices?placement_ids=${placements}&starting_date=${startingDate}&ending_date=${endingDate}`,
    );
  };

  const postOrderLock = params => {
    const {
      beachSpotId,
      placements,
      startingDate,
      endingDate,
      packageId,
    } = params;

    console.log(
      'xxx',
      `beach_spot/${beachSpotId}/orders/lock?placement_ids=${placements}&starting_date=${startingDate}&ending_date=${endingDate}&package_id=${packageId}`,
    );
    return postWithRetry(
      `beach_spot/${beachSpotId}/orders/lock?placement_ids=${placements}&starting_date=${startingDate}&ending_date=${endingDate}&package_id=${packageId}`,
    );
  };

  const postOrderPaymentIntent = params => {
    const {beachSpotId, orderId, paymentType} = params;
    return postWithRetry(
      `beach_spot/${beachSpotId}/orders/stripe_payment_intent?order_id=${orderId}&payment_type=${paymentType}`,
    );
  };

  const postOrderPaymentConfirm = params => {
    const {beachSpotId, orderId, paymentType} = params;
    return postWithRetry(
      `beach_spot/${beachSpotId}/orders/confirm?order_id=${orderId}&payment_type=${paymentType}`,
    );
  };

  const getWeatherForecasts = beachSpotId => {
    console.log('FORECASTING API', beachSpotId);
    return getWithRetry('beach_spot/weather_forecasts/' + beachSpotId);
  };

  const getNearbyBeachSpot = params => {
    return getWithRetry(
      'beach_spot/nearby?' +
        `latitude=${params.latitude}&` +
        `longitude=${params.longitude}&` +
        `limit=${params.limit}&` +
        `km=${params.km}&` +
        `sea_id=${params.sea_id}&` +
        // `around_first_beach_spot=${params.around_first_beach_spot}&&` +
        `spot_type=${params.spot_type}&&` +
        `around_beach_spot=${params.around_beach_spot}`,
    );
  };

  const changeBeachSpotState = data =>
    postWithRetry('beach_spot_state/change', {
      beach_spot_id: data.beach_spot_id,
      beach_state_id: data.beach_state_id,
    });

  const reportBeachSpotState = data =>
    postWithRetry('beach_spot_state/report', {
      beach_spot_id: data.beach_spot_id,
      beach_state_id: data.beach_state_id,
      device_id: data.device_id,
    });

  const getLatestReports = data => getWithRetry('beach_spot_state/reports');

  /* ------------- Auth ------------- */
  const createAccount = data => {
    return postWithRetry('user/create', {
      user: {
        name: data.name,
        email: data.email,
        password: data.password,
        telephone_number: data.telephone_number,
      },
    });
  };

  const updateAccount = data =>
    postWithRetry(`user/${data.id}/update`, {
      user: {
        name: data.name,
        email: data.email,
        password: data.password,
        telephone_number: data.telephone_number,
      },
    });

  const loginEmail = data =>
    postWithRetry('auth/email', {
      user: {email: data.username, password: data.password},
    });

  const loginFacebook = data =>
    postWithRetry('auth/facebook', {
      user: {
        uid: data.userID,
        oauth: data.accessToken,
        expires_at: data.expirationTime.toString(),
      },
    });

  const loginApple = data => {
    const {authorizationCode, identityToken, user, fullName} = data;
    const name =
      fullName?.givenName && `${fullName?.givenName} ${fullName?.familyName}`;

    return postWithRetry('auth/apple', {
      user: {
        oauth: authorizationCode,
        idtoken: identityToken,
        uid: user,
        name,
      },
    });
  };

  const startSession = () => postWithRetry('auth/session_start');

  return {
    setLocale,
    setAuth,
    removeAuth,
    getAllBeachSpot,
    searchBeachSpot,
    getBeachSpot,
    getNearbyBeachSpot,
    getMinAppVersion,
    getInitialVariables,
    createAccount,
    updateAccount,
    loginEmail,
    loginFacebook,
    loginApple,
    startSession,
    changeBeachSpotState,
    reportBeachSpotState,
    getLatestReports,
    getPlacementsStatus,
    getOrderPackages,
    postOrderLock,
    postOrderPaymentIntent,
    postOrderPaymentConfirm,
    getWeatherForecasts,
    getAllOrders,
    getOrder,
  };
};

export default {
  create,
};
