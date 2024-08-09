import {createStackNavigator} from 'react-navigation';

import CommonScreens from './CommonScreens';

import MapScreen from '../Containers/MapTab/MapScreen';
// import SearchScreen from '../../Containers/Search/SearchScreen';
// import SearchRecipeScreen from '../../Containers/Search/SearchRecipeScreen';
// import SearchUserScreen from '../../Containers/Search/SearchUserScreen';
// import CommentsScreen from '../../Containers/Recipe/CommentsScreen';
// import RecipeDetailScreen from '../../Containers/Recipe/RecipeDetailScreen';
// import UserDetailScreen from '../../Containers/User/RecipebookScreen';
// import FollowerScreen from '../../Containers/User/FollowerScreen';
// import FollowingScreen from '../../Containers/User/FollowingScreen';
// import LikesScreen from '../../Containers/Recipe/LikesScreen';
// import RecipesPreferencesScreen from '../../Containers/RecipesPreferencesScreen';

import {Metrics} from '../Themes';
import {Colors} from '../Themes/Colors';
import I18n from 'i18n-js';
import {getTabBarVisibility} from '../Lib/NavigationService';
import ReservationsScreen from '../Containers/Profile/ReservationsScreen';
import ProfileScreen from '../Containers/Profile/ProfileScreen';
const ReservationStackNavigator = createStackNavigator({
  Reservation: {
    screen: ReservationsScreen,
    path: '/',
    navigationOptions: {
      header: null,
    },
  },
  Profile: {
    screen: ProfileScreen,
    path: '/',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonScreens,
});

const screensWithoutTabs = ['OnBoardingScreen'];
ReservationStackNavigator.navigationOptions = ({navigation}) => {
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
    tabBarLabel: 'Prenotazioni',
  };
};

export default ReservationStackNavigator;
