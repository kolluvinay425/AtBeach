import {call, delay, put, select} from 'redux-saga/effects';

import {LocaleConfig} from 'react-native-calendars';
import I18n from 'i18n-js';
import moment from 'moment';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/de';
import moment_locales from '../I18n/moment_locales';

import StartupActions from '../Redux/StartupRedux';
import AppPersistedActions from '../Redux/AppPersistedRedux';
import SplashScreen from 'react-native-splash-screen';
import UserAuthActions from '../Redux/UserAuthRedux';
import * as RNLocalize from 'react-native-localize';
import DeviceInfo from 'react-native-device-info';

const isIOS = Platform.OS === 'ios';

const selectUserData = state => state.userAuth;
const selectLastCacheExpire = state => state.startup.lastCacheExpire;

LocaleConfig.defaultLocale = 'it';
LocaleConfig.locales.it = {
  monthNames: [
    I18n.t('gennaio'),
    I18n.t('febbraio'),
    I18n.t('marzo'),
    I18n.t('aprile'),
    I18n.t('maggio'),
    I18n.t('giugno'),
    I18n.t('luglio'),
    I18n.t('agosto'),
    I18n.t('settembre'),
    I18n.t('ottobre'),
    I18n.t('novembre'),
    I18n.t('dicembre'),
  ],
  monthNamesShort: [
    I18n.t('gennaio'),
    I18n.t('febbraio'),
    I18n.t('marzo'),
    I18n.t('aprile'),
    I18n.t('maggio'),
    I18n.t('giugno'),
    I18n.t('luglio'),
    I18n.t('agosto'),
    I18n.t('settembre'),
    I18n.t('ottobre'),
    I18n.t('novembre'),
    I18n.t('dicembre'),
  ],
  dayNames: [
    I18n.t('domenica'),
    I18n.t('lunedi'),
    I18n.t('martedi'),
    I18n.t('mercoledi'),
    I18n.t('giovedi'),
    I18n.t('venerdi'),
    I18n.t('dabato'),
  ],
  dayNamesShort: [
    I18n.t('domenica').substr(0, 3),
    I18n.t('lunedi').substr(0, 3),
    I18n.t('martedi').substr(0, 3),
    I18n.t('mercoledi').substr(0, 3),
    I18n.t('giovedi').substr(0, 3),
    I18n.t('venerdi').substr(0, 3),
    I18n.t('dabato').substr(0, 3),
  ],
  today: I18n.t('oggi'),
};

LocaleConfig.locales.en = {
  monthNames: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],
  monthNamesShort: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],
  dayNames: [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  today: 'Today',
};

export function* startup(api) {
  yield put(StartupActions.initializing());

  yield put(AppPersistedActions.increaseRuns());
  yield put(UserAuthActions.loginReset());

  const userData = yield select(selectUserData);
  const {locale, login, details} = userData;

  if (locale) {
    const localeBasename = locale.split('-')[0];

    moment.locale(localeBasename); // moment.locale(locale.substring(0, 2));
    api.setLocale(localeBasename);
    I18n.locale = localeBasename;
    LocaleConfig.defaultLocale = localeBasename;
  } else {
    // const deviceLocale = RNLocalize.getLocales()[0].languageCode //DeviceInfo.getDeviceLocale().substring(0, 2);
    // const deviceRegion = RNLocalize.getCountry().toLowerCase() // DeviceInfo.getDeviceCountry().toLowerCase();
    // const fullLocale = `${deviceLocale}-${deviceRegion}`;

    const fullLocale = RNLocalize.getLocales()[0].languageTag.toLowerCase(); //DeviceInfo.getDeviceLocale().substring(0, 2);
    const localeBasename = fullLocale.split('-')[0];

    moment.locale(localeBasename); // moment.locale(deviceLocale.substring(0, 2));
    api.setLocale(localeBasename);
    I18n.locale = localeBasename;
    LocaleConfig.defaultLocale = localeBasename;

    yield put(UserAuthActions.setLocalization(localeBasename, false));
  }

  Object.keys(moment_locales).forEach(locale => {
    moment.updateLocale(locale, moment_locales[locale]);
  });

  // CHECKING APP MINVERSION
  let isVersionValid = true;
  const minverResponse = yield call(api.getMinAppVersion, {
    platform: isIOS ? 'ios' : 'android',
  });

  if (minverResponse && minverResponse.data && minverResponse.data.build) {
    let minBuild = parseInt(minverResponse.data.build, 10);
    let curBuild = parseInt(DeviceInfo.getBuildNumber(), 10);
    isVersionValid = curBuild >= minBuild;
  }

  let lastCacheExpire = yield select(selectLastCacheExpire);

  if (
    !lastCacheExpire ||
    (minverResponse &&
      minverResponse.data &&
      minverResponse.data.min_cache_expire &&
      moment(minverResponse.data.min_cache_expire) > moment(lastCacheExpire))
  ) {
    yield put({type: 'EXPIRE_CACHE'});
  }

  if (isVersionValid) {
    if (login.isLogged) {
      if (details) {
        api.setAuth(details.email, details.authentication_token);

        yield delay(500);
        const response = yield call(api.startSession);
      } else {
        yield put(UserAuthActions.logout());
      }
    }

    // TODO if cache do not call
    yield* loadInitialData();

    yield put(StartupActions.initialized());
  } else {
    console.log('I AM HERE MAN');
    yield put(StartupActions.forceUpdate());
  }

  setTimeout(function() {
    console.log('HIDING SPLASH SCREEN');
    SplashScreen.hide();
  }, 200);
}

export function* loadInitialData() {
  yield put(StartupActions.getInitVariablesRequest());
}

export function* getInitialVariables(api) {
  const response = yield call(api.getInitialVariables);
  if (response.ok) {
    yield put(StartupActions.getInitVariablesSuccess(response.data));
  } else {
    // yield put(BeachSpotsActions.getAllBeachSpotsFailure(response.status));
  }
}
