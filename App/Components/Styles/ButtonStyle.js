import {Colors, Fonts} from '../../Themes/';
import {StyleSheet} from 'react-native';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.lightText,
        borderRadius: 999,
        paddingVertical: 9,
        paddingHorizontal: 26,
      },
      buttonOutline: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.activeButton,
        borderRadius: 999,
        paddingVertical: 9,
        paddingHorizontal: 26,
      },
      buttonOutlineText: {
        ...Fonts.style.normal,
        fontSize: Fonts.size.normal,
        color: Colors.activeButton,
      },
      buttonOutlineBig: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.activeButton,
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 32,
      },
      buttonActive: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.activeButton,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.activeButton,
        borderRadius: 999,
        paddingVertical: 9,
        paddingHorizontal: 26,
      },
      buttonActiveBig: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.activeButton,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.activeButton,
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 32,
      },
      titleOutline: {
        fontSize: Fonts.size.normal,
        color: Colors.activeButton,
      },
      titleActive: {
        fontSize: Fonts.size.normal,
        color: Colors.white,
      },
      title: {
        fontSize: Fonts.size.normal,
        color: Colors.lightText,
      },
    });
  }
}
