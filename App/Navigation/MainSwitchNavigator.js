import MainTabNavigator from './MainTabNavigator';
// import LoginStackNavigator from "./LoginStackNavigator"
import StartupScreen from '../Containers/StartupScreen';
import ForceUpdateScreen from '../Containers/ForceUpdateScreen';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

const AppNavigator = createSwitchNavigator(
  {
    StartUp: StartupScreen,
    ForceUpdate: ForceUpdateScreen,
    MainTabNavigator: MainTabNavigator,
  },
  {
    initialRouteName: 'StartUp',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
