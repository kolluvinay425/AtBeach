// @flow

import {StyleSheet} from 'react-native';
import {ApplicationStyles, Fonts, Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.screen,
      mainTabContainer: {
        backgroundColor: 'white',
        padding: Metrics.doubleBaseMargin,
        flex: 1,
      },
      content: {
        paddingVertical: Metrics.baseMargin,
      },
      contentRow: {
        paddingVertical: Metrics.baseMargin,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      separator: {
        backgroundColor: Colors.lightergrey,
        height: 1,
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
        height: 50,
        color: Colors.text,
        fontFamily: Fonts.type.base,
      },
      error: {
        fontSize: Fonts.size.small,
        color: Colors.error,
        fontFamily: Fonts.type.light,
      },
      value: {
        fontSize: Fonts.size.regular,
        color: Colors.grey,
        fontFamily: Fonts.type.light,
      },
      button: {
        backgroundColor: Colors.activeButton,
        marginVertical: Metrics.baseMargin,
        marginHorizontal: 40,
        padding: Metrics.baseMargin,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 25,
      },
      buttonText: {
        color: 'white',
        fontFamily: Fonts.type.base,
        fontSize: Fonts.size.input,
      },
      image: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        marginVertical: Metrics.doubleBaseMargin,
        height: 16,
        width: 180,
      },
    });
  }
}
