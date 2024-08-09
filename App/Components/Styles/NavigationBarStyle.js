import {Platform, StyleSheet} from 'react-native';

import {Fonts, Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

// const fixPaddingTop = () => {
//   if (!isIOS){
//     return {paddingTop: 0}
//   } else {
//     return ifIphoneX({ paddingTop: 0 }, {paddingTop: Metrics.statusBarHeight})
//   }
// }

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Metrics.navBarHeightAdjusted,
        paddingHorizontal: Metrics.smallMargin,
        paddingTop: Metrics.navBarOverStatusPaddingTop,
        backgroundColor: Colors.lightergrey,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
      },
      titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Metrics.navBarHeightAdjusted,
        paddingTop: Metrics.navBarOverStatusPaddingTop,
        justifyContent: 'center',
        alignItems: 'center',
      },
      actionContainer: {
        position: 'absolute',
        top: 0,
        left: 0, // Metrics.smallMargin,
        right: 0, // Metrics.smallMargin,
        height: Metrics.navBarHeightAdjusted,
        paddingTop: Metrics.navBarOverStatusPaddingTop,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      rightActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      title: {
        ...Fonts.style.navBarTitle,
      },
    });
  }
}
