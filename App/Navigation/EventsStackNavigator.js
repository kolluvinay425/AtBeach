import {createStackNavigator} from 'react-navigation';

import CommonScreens from './CommonScreens';

import {Metrics} from '../Themes';
import {Colors} from '../Themes/Colors';
import I18n from 'i18n-js';
import {getTabBarVisibility} from '../Lib/NavigationService';
import BeachSpotEvents from '../Containers/Profile/BeachSpotEvents';
const EventsStackNavigator = createStackNavigator({
  Event: {
    screen: BeachSpotEvents,
    path: '/',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonScreens,
});

const screensWithoutTabs = ['OnBoardingScreen'];
EventsStackNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (
    navigation.state.index > 0 ||
    screensWithoutTabs.includes(
      navigation.state.routes[navigation.state.index].routeName,
    )
  ) {
    tabBarVisible = false;
  }

  const forcedTabVisibility = getTabBarVisibility();
  if (forcedTabVisibility !== null) {
    tabBarVisible = forcedTabVisibility;
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Eventi',
  };
};

export default EventsStackNavigator;
