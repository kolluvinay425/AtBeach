// @flow

import {Platform, StyleSheet} from 'react-native';

import {Fonts, Metrics} from '../../Themes';
import {Colors} from '../../Themes/Colors';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 50,
        paddingHorizontal: 24,
      },
      titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Metrics.doubleBaseMargin,
      },
      title: {
        color: '#1D1919',
        fontFamily: Fonts.type.bold,
        fontSize: 32,
        textAlign: 'center',
        flex: 1,
      },
      button: {
        height: 55,
        backgroundColor: Colors.activeButton,
        width: Metrics.windowWidth - 90,
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Metrics.baseMargin,
      },
      buttonText: {
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base,
        color: 'white',
        marginLeft: 10,
        fontWeight: '800',
      },
      text: {
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.base,
        color: '#A4AEB7',
        textAlign: 'center',
      },
      smallText: {
        fontSize: Fonts.size.mini,
        fontFamily: Fonts.type.base,
        color: '#A4AEB7',
        textAlign: 'center',
      },
      separator: {
        alignItems: 'center',
        marginVertical: 10,
        flex: 1,
      },
      textInput: {
        backgroundColor: 'rgba(0, 117, 246, 0.05)',
        width: Metrics.windowWidth - 48,
        borderRadius: 8,
        fontSize: Fonts.size.medium,
        borderWidth: 0,
        height: 60,
        color: Colors.text,
        fontFamily: Fonts.type.base,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginVertical: 5,
      },
      smallTextInput: {
        width: (Metrics.windowWidth - 48) * 0.5 - 5,
      },
      // error: {
      //   fontSize: Fonts.size.small,
      //   color: Colors.error,
      //   fontFamily: Fonts.type.light,
      // },
    });
  }
}
