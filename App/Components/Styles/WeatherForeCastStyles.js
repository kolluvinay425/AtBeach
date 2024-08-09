import {StyleSheet} from 'react-native';
import {Colors, Fonts, Images, Metrics} from '../../Themes';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      //   container: {
      //     paddingVertical: Metrics.doubleBaseMargin,
      //     paddingRight: this.props.showArrow ? 0 : Metrics.baseMargin,
      //   },
      containerOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Metrics.doubleBaseMargin,
      },
      containerTwo: {
        alignItems: 'center',
      },
      containerTwoTextOne: {
        fontSize: 19,
        fontFamily: Fonts.type.bold,
        lineHeight: 20,
        marginVertical: 5,
      },
      containerTwoTextTwo: {
        fontSize: 14,
        fontFamily: Fonts.type.base,
        lineHeight: 18,
        color: Colors.text,
      },
      containerThree: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      containerThreeimage: {
        width: 30,
        height: 30,
      },
      containerThreeText: {
        marginLeft: 5,
        fontFamily: Fonts.type.base,
        color: Colors.text
      },
      containerSubText: {
        marginLeft: 5,
        fontFamily: Fonts.type.light,
        color: Colors.sukaGrey,
      },
    });
  }
}
