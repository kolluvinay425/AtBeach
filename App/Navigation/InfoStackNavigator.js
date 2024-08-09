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
import ApplicationStyles from '../Themes/ApplicationStyles';
import {getTabBarVisibility} from '../Lib/NavigationService';
import ErrorBoundaryScreen from '../Containers/ErrorBoundaryScreen';
import InfoScreen from '../Containers/Profile/InfoScreen';
import NotificationsScreen from '../Containers/Profile/InfoScreen';

import {store} from '../Redux/index';
import {select} from 'redux-saga/effects';
import BeachSpotDetailsScreen from '../Containers/MapTab/BeachSpotDetailsScreen';
import TabIcon from '../Components/Navigation/TabIcon';
import React from 'react';
import {Platform} from 'react-native';

import {BeachPrivateSpotDetailsScreen} from '../Containers/MapTab/BeachPrivateSpotDetailsScreen';

const isIOS = Platform.OS === 'ios';

const selectUserDetails = state => state.userAuth.details;

const InfoStackNavigator = createStackNavigator(
  {
    Info: {
      screen: InfoScreen,
      path: '/',
      navigationOptions: {
        header: null,
      },
    },
    BeachSpotDetails: {
      screen: BeachSpotDetailsScreen,
      path: '/',
      navigationOptions: {
        header: null,
      },
    },
    BeachSpotPrivateDetails: {
      screen: BeachPrivateSpotDetailsScreen,
      path: '/',
      navigationOptions: {
        header: null,
      },
    },
    ...CommonScreens,
  },
  //   Recipe: {
  //     path: '/',
  //     screen: RecipeDetailScreen,
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   User: {
  //     path: '/',
  //     screen: UserDetailScreen,
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   Followers: {
  //     path: '/',
  //     screen: FollowerScreen,
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   Following: {
  //     path: '/',
  //     screen: FollowingScreen,
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   Likes: {
  //     path: '/',
  //     screen: LikesScreen,
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   Search: {
  //     screen: SearchScreen,
  //     path: '/',
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   SearchRecipe: {
  //     screen: SearchRecipeScreen,
  //     path: '/',
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   SearchUser: {
  //     screen: SearchUserScreen,
  //     path: '/',
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   Comments: {
  //     screen: CommentsScreen,
  //     path: '/',
  //     navigationOptions: {
  //       headerTitleStyle: ApplicationStyles.navBar.navBarTitle,
  //       headerTintColor: Colors.text,
  //       headerStyle: {
  //         borderBottomColor: Colors.lightergrey,
  //         backgroundColor: 'white',
  //         height: Metrics.bigNavBarHeight,
  //       },
  //     },
  //   },
  //   RecipePreferences: {
  //     path: '/',
  //     screen: RecipesPreferencesScreen,
  //     navigationOptions: {
  //       header: null,
  //     },
  //   },
  //   ...LoginNavScreens,
  // },
);

const screensWithoutTabs = ['OnBoardingScreen'];
InfoStackNavigator.navigationOptions = ({navigation}) => {
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

  const userDetails = store.getState().userAuth.details;
  const logged = userDetails && userDetails.id
  const owner = userDetails && userDetails.owner && userDetails.owner.id;

  // console.log(userDetails)

  return {
    tabBarVisible,
    tabBarIcon: ({tintColor, focused}) => (
      <TabIcon
        collectionName={'FontAwesome'}
        iconName={ logged ? (owner ? 'bell' : 'list-ul') : 'info-circle' }
        size={logged ? (owner ? (isIOS ? 24 : 26) : (isIOS ? 23 : 25)) : (isIOS ? 24 : 26)}
        selected={focused}
      />
    ),
    tabBarLabel: logged ? (owner ? 'Notifiche' : I18n.t('tabs_orders')) : I18n.t('tabs_info'),
  };
};

export default InfoStackNavigator;
