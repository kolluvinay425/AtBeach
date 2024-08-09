import * as Sentry from '@sentry/react-native';
import DebugSettings from './DebugSettings';
import DeviceInfo from 'react-native-device-info';

import { Settings } from 'react-native-fbsdk-next';

export default () => {

  // FACEBOOK SDK SETTINGS
  Settings.setAppID('341492677539299');
  Settings.initializeSDK();

  if (__DEV__) {
    console.disableYellowBox = !DebugSettings.yellowBox;
  } else {
    let curBuild = DeviceInfo.getBuildNumber();

    Sentry.init({
      dsn:
        'https://3e9b3fa2e1fb4f0ca26fbb481ae4cdba@o403665.ingest.sentry.io/5266557',
      release: curBuild,
      environment: 'production',
    });
  }

  // Text.defaultProps.allowFontScaling = AppConfig.allowTextFontScaling;
};
