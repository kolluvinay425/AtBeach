import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import './App/Config/ReactotronConfig';

import {App} from './App/Containers/App';

AppRegistry.registerComponent(appName, () => App);
