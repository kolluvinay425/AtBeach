import {Fonts} from '../../Themes/';
import {Colors} from '../../Themes/Colors';
import {StyleSheet} from 'react-native';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        padding: 5,
      },
      title: {
        fontSize: Fonts.size.regular,
        color: Colors.activeButton,
        marginHorizontal: 5,
      },
    });
  }
}
