import React from 'react';
// import PropTypes from "prop-types";
import {
  Alert,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
// import {connect} from "react-redux";
import {createBottomTabNavigator} from 'react-navigation';

import MapStackNavigator from './MapStackNavigator';
import TabIcon from '../Components/Navigation/TabIcon';
// import BadgeTabIcon from "../Components/BadgeTabIcon";
// import AVTabIcon from "../Containers/Assistant/Components/AVTabIcon";
import TabBar from '../Components/Navigation/TabBar';

import {Fonts} from '../Themes';
import {Colors} from '../Themes/Colors';
import GDPRScreen from '../Containers/GDPRScreen';
import ErrorBoundaryScreen from '../Containers/ErrorBoundaryScreen';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import InfoStackNavigator from './InfoStackNavigator';
import ReservationStackNavigator from './ReservationStackNavigator';
import EventsStackNavigator from './EventsStackNavigator';
import * as NavigationService from '../Lib/NavigationService';
import {store} from '../Redux';
import {isIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = isIphoneX();

// const tabComponentConfig = isIOS ? {} : {tabBarComponent: OTabBar};

const mainRefreshTimer = null;

const onLongPressMainTab = () => {
  store.dispatch({type: 'GET_ALL_BEACH_SPOTS_REQUEST'});
};
const onPressMainTab = () => {
  NavigationService.navigate('Home');
};

export const MainTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: MapStackNavigator,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <TouchableOpacity
            onPress={onPressMainTab}
            onLongPress={onLongPressMainTab}>
            <TabIcon
              collectionName={'inspiaggia'}
              iconName={'btm_explore'}
              size={isIOS ? 24 : 26}
              selected={focused}
            />
          </TouchableOpacity>
        ),
      },
    },
    // Info: {
    //   screen: InfoStackNavigator,
    // },

    //  Reservation: {
    //    screen: ReservationStackNavigator,
    //    navigationOptions: {
    //      tabBarIcon: ({tintColor, focused}) => (
    //        <TabIcon
    //          collectionName={'inspiaggia'}
    //          iconName={'btm_reserve'}
    //          size={isIOS ? 24 : 26}
    //          selected={focused}
    //        />
    //      ),
    //    },
    //  },
    Event: {
      screen: EventsStackNavigator,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <TabIcon
            collectionName={'inspiaggia'}
            iconName={'btm_reserve'}
            size={isIOS ? 24 : 26}
            selected={focused}
          />
        ),
      },
    },

    Favorites: {
      screen: FavoritesStackNavigator,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <TabIcon
            collectionName={'inspiaggia'}
            iconName={'btm_fav'}
            size={isIOS ? 24 : 26}
            selected={focused}
          />
        ),
      },
    },

    Profile: {
      screen: ProfileStackNavigator,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <TabIcon
            collectionName={'inspiaggia'}
            iconName={'btm_profile'}
            size={isIOS ? 24 : 26}
            selected={focused}
          />
        ),
      },
    },
    //   Personal: {
    //     screen: PersonalStackNavigator,
    //     navigationOptions: {
    //       tabBarIcon: ({tintColor, focused}) => (
    //         <TabIcon
    //           iconName={focused ? "faves17_on" : "faves17"}
    //           size={isIOS ? 28 : 26}
    //           selected={focused}
    //         />
    //       )
    //     }
    //   },
    //   AV: {
    //     screen: AVStackNavigator,
    //     navigationOptions: {
    //       tabBarIcon: () => (
    //         <AVTabIcon size={80}/>
    //       )
    //     }
    //   },
    //   Shopping: {
    //     screen: ShoppingStackNavigator,
    //     navigationOptions: {
    //       tabBarIcon: ({tintColor, focused}) => (
    //         <TabIcon
    //           iconName={focused ? "cart17_on" : "cart17"}
    //           size={isIOS ? 28 : 26}
    //           selected={focused}
    //         />
    //       )
    //     }
    //   },
    //   Profile: {
    //     screen: ProfileStackNavigator,
    //     navigationOptions: {
    //       tabBarIcon: ({tintColor, focused}) => (
    //         <BadgeTabIcon
    //           iconName={focused ? "profile17_on" : "profile17"}
    //           size={isIOS ? 28 : 26}
    //           selected={focused}
    //         />
    //       )
    //     }
    //   }
  },
  {
    // ...TabNavigator.Presets.iOSBottomTabs,
    // ...tabComponentConfig,
    initialRouteName: 'Home',
    // tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarComponent: TabBar,
    // tabBarOptions: {

    //   style: {
    //
    //   }
    // },
    tabBarOptions: {
      safeAreaInset: {bottom: 'never', top: 'never'},
      activeTintColor: Colors.activeButton,
      inactiveTintColor: Colors.grey,
      showLabel: true,
      showIcon: true,
      lazyLoad: true,
      labelStyle: {
        fontFamily: Fonts.type.base,
        fontSize: Fonts.size.tiny,
        marginBottom: isIOS ? 5 : 3,
        marginTop: isIOS ? 0 : -7,
      },
      style: {
        // ANDROID BUG IF ABSOLUTE TAB BAR IS NOT CLICKABLE
        position: isIOS ? 'absolute' : 'relative',
        left: isIOS ? 20 : 0,
        right: isIOS ? 20 : 0,
        bottom: isIOS ? (isIPhoneX ? 33 : 17) : 0,
        height: isIOS ? 70 : 74,
        margin: 0,
        padding: 0,
        paddingVertical: 7,
        backgroundColor: 'white',
        borderRadius: isIOS ? 8 : 0,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 1,
        borderWidth: 0.5,
        borderColor: 'rgba(51,51,51,0.10)',
        borderTopWidth: isIOS ? 0 : 0.7,
      },
    },
  },
);

export default MainTabNavigator;
