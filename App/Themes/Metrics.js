// @flow

import {Dimensions, PixelRatio, Platform} from 'react-native';
import {Header} from 'react-navigation'; // THE HEADER OF THE APP, THE ONE WITH THE BACK BUTTON
import {
  getStatusBarHeight,
  isIPhoneX,
  isIPhoneWithMonobrow,
  isIPhone12Max,
  isIPhone12,
} from 'react-native-status-bar-height';
import {Metrics} from './index';
import { initialWindowMetrics } from 'react-native-safe-area-context'

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const WINDOW_DIMENSIONS = Dimensions.get('window');

// { height: ExtraDimensions.getRealWindowHeight(), width: ExtraDimensions.getRealWindowWidth() }

// console.log("\n\n\nSCREEN HEIGHT 1", SCREEN_DIMENSIONS.height)
// console.log("\n\n\nWINDOW HEIGHT 1", WINDOW_DIMENSIONS.height)
// console.log("\n\n\nWINDOW HEIGHT 2", ExtraDimensions.getRealWindowHeight())
//
// console.log("\n\n\nSTATUS BAR HEIGHT", getStatusBarHeight())
// console.log("\n\n\nHEADER HEIGHT", Header.HEIGHT)
// console.log("\n\n\nWINDOW HEIGHT 3", ExtraDimensions.getRealWindowHeight())

// const HEIGHT = Platform.OS === 'ios' ? height : height - 25;

const isIOS = Platform.OS === 'ios';

const NAV_BAR_HEIGHT = 56
const IPHONE_STATUS_BAR_HEIGHT = (isIPhone12() || isIPhone12Max()) ? 25 : getStatusBarHeight(true)
const NAV_BAR_HEIGHT_ADJUSTED = isIPhoneWithMonobrow() ? NAV_BAR_HEIGHT + ((isIPhone12() || isIPhone12Max())? IPHONE_STATUS_BAR_HEIGHT : 0) : NAV_BAR_HEIGHT

const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  tripleBaseMargin: 30,
  quadrupleBaseMargin: 40,
  eightBaseMargin: 80,
  smallMargin: 5,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  bottomBarMargin: isIPhoneWithMonobrow() ? 80 : 0,
  windowWidth: WINDOW_DIMENSIONS.width, // width < HEIGHT ? width : HEIGHT,
  windowHeight: WINDOW_DIMENSIONS.height, // width < HEIGHT ? HEIGHT : width,
  screenWidth: SCREEN_DIMENSIONS.height,
  screenHeight: SCREEN_DIMENSIONS.height,
  usableHeight: isIOS ? initialWindowMetrics.frame.height - initialWindowMetrics.insets.top - initialWindowMetrics.insets.bottom : initialWindowMetrics.frame.height,
  navBarHeight: Header.HEIGHT, //(Platform.OS === 'ios') ? 64 : 56,
  bigNavBarHeight: NAV_BAR_HEIGHT,
  navBarHeightAdjusted: NAV_BAR_HEIGHT_ADJUSTED,
  navBarOverStatusPaddingTop: getStatusBarHeight(true),
  tabBarHeight: 48, // (Platform.OS === 'ios') ? 45 : 50,
  tabBarHeightCustom: 54,
  buttonRadius: 4,
  statusBarHeight: getStatusBarHeight(), //(Platform.OS === 'ios') ? 20 : 0,
  parallaxHeaderHeight: WINDOW_DIMENSIONS.width, // HEIGHT * 0.7,
  parallaxScrollOffset: WINDOW_DIMENSIONS.height * 0.5,
  recipeParallaxVisibleContentHeight:
    WINDOW_DIMENSIONS.height - WINDOW_DIMENSIONS.width, // HEIGHT * 0.3,
  avBottomHeight: 140,
  icons: {
    tiny: 15,
    small: 23,
    regular: 28,
    normal: 30,
    medium: 34,
    large: 45,
    xl: 75,
    xxl: 112,
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300,
  },
};

// // based on iphone 5s's scale
// const scale = metrics.screenWidth / 320;
// export const normalize = (size) => {
//   const newSize = size * scale
//   if (Platform.OS === 'ios') {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize))
//   } else {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
//   }
// }

export default metrics;
