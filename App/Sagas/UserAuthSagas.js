import {call, put, select, delay} from 'redux-saga/effects';
import 'moment/locale/it';
import 'moment/locale/es';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {showMessage} from 'react-native-flash-message';

import StartupActions from '../Redux/StartupRedux';
import UserAuthActions from '../Redux/UserAuthRedux';
import ReactNativeRestart from 'react-native-restart';

export function* createAccount(api, action) {
  const {data, callback} = action;
  const response = yield call(api.createAccount, data);

  if (response.ok) {
    if (response.data.confirmed_at) {
      api.setAuth(response.data.email, response.data.authentication_token);
      yield put(UserAuthActions.loginSuccess(response.data));
    } else {
      callback();
      yield put(UserAuthActions.loginFailure(response.status));
    }
  } else {
    yield put(UserAuthActions.loginFailure(response.status));
  }
}

export function* updateAccount(api, action) {
  const {data} = action;

  const response = yield call(api.updateAccount, data);
  if (response.ok) {
    api.setAuth(response.data.email, response.data.authentication_token);
    const respononse2 = yield call(api.startSession);

    if (respononse2.ok) {
      yield put(UserAuthActions.loginSuccess(response.data));
    } else {
      yield put(UserAuthActions.loginFailure(respononse2.status));
    }
  } else {
    yield put(UserAuthActions.loginFailure(response.status));
  }
}

export function* loginWithEmail(api, action) {
  const {data, callback} = action;

  const response = yield call(api.loginEmail, data);
  if (response.ok) {
    api.setAuth(response.data.email, response.data.authentication_token);

    const respononse2 = yield call(api.startSession);

    if (respononse2.ok) {
      yield put(UserAuthActions.loginSuccess(response.data));
    } else {
      yield put(UserAuthActions.loginFailure(respononse2.status));
    }
  } else {
    if (response.status === 403) {
      callback();
    }
    yield put(UserAuthActions.loginFailure(response.status));
  }
}

export function* loginWithFacebook(api, action) {
  // Attempt a login using the Facebook login dialog asking for default permissions.
  const loginManagerResponse = yield call(LoginManager.logInWithPermissions, [
    'public_profile',
    'email',
  ]);

  if (loginManagerResponse.isCancelled) {
    console.log('Login cancelled');
    yield put(UserAuthActions.loginFailure(''));
  } else {
    const accessTokenResult = yield call(AccessToken.getCurrentAccessToken);
    console.log('accessTokenResult', accessTokenResult);

    const response = yield call(api.loginFacebook, accessTokenResult);
    if (response.ok) {
      api.setAuth(response.data.email, response.data.authentication_token);

      const respononse2 = yield call(api.startSession);

      if (respononse2.ok) {
        yield put(UserAuthActions.loginSuccess(response.data));
        action.callback();
      } else {
        yield put(UserAuthActions.loginFailure(respononse2.status));
      }
    } else {
      yield put(UserAuthActions.loginFailure(response.status));
    }
  }
}

export function* loginWithApple(api, action) {
  try {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    const appleAuthRequestResponse = yield call(
      [appleAuth, appleAuth.performRequest],
      {
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      },
    );

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = yield call(
      [appleAuth, appleAuth.getCredentialStateForUser],
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const response = yield call(api.loginApple, appleAuthRequestResponse);
      if (response.ok) {
        api.setAuth(response.data.email, response.data.authentication_token);

        const respononse2 = yield call(api.startSession);

        if (respononse2.ok) {
          yield put(UserAuthActions.loginSuccess(response.data));
        } else {
          yield put(UserAuthActions.loginFailure(respononse2.status));
        }
        action.callback();
      } else {
        yield put(UserAuthActions.loginFailure(response.status));
      }
    } else {
      yield put(UserAuthActions.loginFailure(''));
    }
  } catch (error) {
    yield put(UserAuthActions.loginFailure(''));
    // if (error.code === AppleAuthError.CANCELED) {
    // }
    // if (error.code === AppleAuthError.FAILED) {
    //   alert('Touch ID wrong');
    // }
    // if (error.code === AppleAuthError.INVALID_RESPONSE) {
    //   alert('Touch ID wrong');
    // }
    // if (error.code === AppleAuthError.NOT_HANDLED) {
    // }
    // if (error.code === AppleAuthError.UNKNOWN) {
    //   alert('Touch ID wrong');
    // }
  }
}

export function* logout(api) {
  api.setAuth('', '');

  yield put({type: 'EXPIRE_CACHE'});

  yield delay(1000);

  // STARTUP THE APP
  yield put(StartupActions.startup());
}

export function* setLocalization(action) {
  if (action.restart) {
    yield put({type: 'EXPIRE_CACHE'});
    setTimeout(() => {
      ReactNativeRestart.Restart();
    }, 1000);
  }
}
