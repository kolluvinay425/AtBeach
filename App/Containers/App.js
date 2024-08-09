// @flow

import React, {useRef, useState} from 'react';
import {Provider} from 'react-redux';
import RootContainer from './RootContainer';
import {persistor, store} from '../Redux';
import applyConfigSettings from '../Config';
import {PersistGate} from 'redux-persist/integration/react';
import {Host} from 'react-native-portalize';
import FlashMessage from 'react-native-flash-message';
import { StripeProvider } from '@stripe/stripe-react-native';

// import { enableScreens } from 'react-native-screens';
import {
  setMapRef,
  setSuperClusterRef,
  setVideoPlayerPlaying,
  setVideoPlayerRef,
} from '../Lib/MapService';
// enableScreens(); //TODO DISABLED DUE TO BUG https://github.com/archriss/react-native-render-html/issues/393

// Apply config overrides
applyConfigSettings();

const stripeKey = __DEV__ ?
  'pk_test_51If56uCQW0Qw4RmZPt9Ot8XGcp6ZVW2AJaOJz7BGrD3hLbarYuGE6kKThawwSl9qvCt2KengfuQe26uxrOx1rotT00caffxxS3' :
  'pk_live_51If56uCQW0Qw4RmZaM0LuINBNK6ZPcesINxBop1avErYtDb8a9kQTWl0KBLklnfndCpL6WC2fzTNqTRgt1YoEGS100ihgKE1A5'

import noop from 'loadsh/noop';

if (!__DEV__) {
  for (const iterator of Object.keys(global.console)) {
    global.console[iterator] = noop;
  }
}

export const App = () => {
  setMapRef(useRef(null));
  setSuperClusterRef(useRef(null));
  setVideoPlayerRef(useRef(null));
  setVideoPlayerPlaying(useState(false));

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Host>
          <StripeProvider
            publishableKey={stripeKey}
            // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
          >
            <RootContainer />
          </StripeProvider>
          <FlashMessage position="top" />
        </Host>
      </PersistGate>
    </Provider>
  );
};
