import {Platform, StyleSheet} from 'react-native';

import {Fonts, Metrics} from '../../../Themes';
import {Colors} from '../../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        width: Metrics.windowWidth,
        height: Metrics.navBarHeightAdjusted, //+ Metrics.baseMargin,
        paddingTop: Metrics.navBarOverStatusPaddingTop,
        paddingHorizontal: Metrics.baseMargin,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isIOS ? 'transparent' : Colors.navbarTrasparent,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderColor: Colors.lightergrey,
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
        },
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      searchIcon: {
        color: Colors.activeButton,
      },
      content: {
        shadowColor: 'black',
        shadowOpacity: 0.3,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: Colors.lightergrey,
        borderWidth: 0.5,
        alignItems: 'center',
        shadowRadius: 2,
        overflow: 'hidden',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        elevation: 1,
        padding: Metrics.baseMargin,
        borderRadius: 3,
        height: 42,
      },
      text: {
        fontSize: 17,
        fontFamily: Fonts.type.light,
        color: Colors.lightgrey,
        marginLeft: 10,
        width: '85%',
      },
      button: {
        paddingVertical: Metrics.baseMargin,
      },
      logo: {
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        width: 50,
      },
    });
  }
}
