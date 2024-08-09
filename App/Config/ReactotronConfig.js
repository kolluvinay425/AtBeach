import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';
import sagaPlugin from 'reactotron-redux-saga';
import apisaucePlugin from 'reactotron-apisauce';

let reactotron = null;

if (__DEV__) {
  reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
    .configure({name: 'Oreegano'}) // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(reactotronRedux()) // redux plugin
    .use(sagaPlugin()) //saga plugin
    .use(
      apisaucePlugin({
        ignoreContentTypes: /^(image)\/.*$/i, // <--- a way to skip printing the body of some requests (default is any image)
      }),
    ) // apisauce plugin
    .connect(); // let's connect!

  reactotron.clear();
} else {
  // force not to log in prod
  console.log = console.info = console.error = console.warn = console.debug = console.trace = () => {};
}

export default reactotron;
