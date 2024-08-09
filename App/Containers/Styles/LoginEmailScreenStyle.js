// @flow

import {Platform, StyleSheet} from 'react-native';
import {Fonts, Metrics} from '../../Themes';
import {Colors} from '../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      mainTabContainer: {
        backgroundColor: 'white',
        padding: Metrics.doubleBaseMargin,
      },
      title: {
        color: '#fff',
        fontFamily: Fonts.type.bold,
        fontSize: 25,
        paddingBottom: Metrics.doubleBaseMargin,
      },
      button: {
        height: 46,
        backgroundColor: Colors.activeButton,
        borderRadius: 26,
        width: Metrics.windowWidth - 2 * Metrics.doubleBaseMargin,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Metrics.baseMargin,
      },
      text: {
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base,
        color: 'white',
      },
      activeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Metrics.doubleBaseMargin,
        paddingHorizontal: Metrics.baseMargin,
      },
      activeText: {
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base,
        color: Colors.activeButton,
        textAlign: 'center',
      },
      modalHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Metrics.windowWidth,
        height: Metrics.navBarHeightAdjusted,
        backgroundColor: 'transparent',
        paddingTop: isIOS ? Metrics.statusBarHeight : 0,
        // paddingTop: Metrics.statusBarHeight,
        paddingHorizontal: Metrics.baseMargin,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
      infoTextContainer: {
        padding: Metrics.doubleBaseMargin,
      },
      infoText: {
        marginTop: Metrics.doubleBaseMargin,
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base,
        color: Colors.text,
        textAlign: 'center',
      },
      separator: {
        backgroundColor: Colors.lightergrey,
        height: 1,
      },
      content: {
        paddingVertical: Metrics.baseMargin,
      },
      label: {
        fontSize: Fonts.size.regular,
        color: Colors.text,
        fontFamily: Fonts.type.light,
      },
      textInput: {
        fontSize: Fonts.size.h5,
        borderWidth: 0,
        borderRadius: 3,
        height: 60,
        color: Colors.text,
        fontFamily: Fonts.type.base,
      },
      error: {
        fontSize: Fonts.size.small,
        color: Colors.error,
        fontFamily: Fonts.type.light,
      },
    });
  }
}
