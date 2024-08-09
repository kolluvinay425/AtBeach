// @flow

import {StyleSheet} from 'react-native';
import {Fonts, Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // width: '100%',
        // paddingVertical: 20,
        paddingHorizontal: Metrics.doubleBaseMargin,
        height: 57,
        marginVertical: Metrics.baseMargin,
        marginHorizontal: Metrics.doubleBaseMargin,
        borderWidth: 1,
        borderColor: '#DFDFDF',
        borderRadius: 10,
      },
      menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      menuItemText: {
        fontFamily: Fonts.type.light,
        fontSize: Fonts.size.normal,
        color: Colors.blueText,
        flex: 1,
        paddingLeft: Metrics.baseMargin
      },
      separator: {
        backgroundColor: Colors.lightergrey,
        height: 1,
      },
    });
  }
}
