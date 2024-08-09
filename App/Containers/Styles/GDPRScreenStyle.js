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
        flex: 1,
      },
      content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: Colors.sukinoGrey,
      },
      titleContainer: {
        marginBottom: 10,
        paddingHorizontal: 20,
      },
      title: {
        fontSize: 20,
        color: Colors.text,
        fontFamily: Fonts.type.bold,
      },
      contentTitle: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.text,
        fontFamily: Fonts.type.bold,
        paddingVertical: 5,
      },
      contentTitleUnderline: {
        fontSize: 14,
        color: Colors.text,
        fontFamily: Fonts.type.light,
        paddingVertical: 5,
        textDecorationLine: 'underline',
      },
      contentText: {
        fontSize: 14,
        color: Colors.text,
        fontFamily: Fonts.type.light,
        paddingVertical: 5,
      },
      switchContainer: {
        paddingVertical: Metrics.baseMargin,
        flexDirection: 'row',
        alignItems: 'center',
      },
      bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    });
  }
}
