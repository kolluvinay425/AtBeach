// @flow

import {Platform, StyleSheet} from 'react-native';
import {Fonts, Metrics} from '../../Themes/';
import {Colors} from '../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      navigationBarStyle: {
        position: 'absolute',
        top: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
      },
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
      },
      content: {
        paddingTop: 42,
        marginTop: 42,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: isIOS ? 10 : 0,
        paddingVertical: 15,
      },
      modalTitle: {
        color: Colors.text,
        fontSize: Fonts.size.h5,
        fontFamily: Fonts.type.bold,
        textAlign: 'center',
        margin: Metrics.baseMargin,
        paddingHorizontal: Metrics.baseMargin,
      },
      modalMessage: {
        color: Colors.grey,
        fontSize: 16,
        fontFamily: Fonts.type.base,
        textAlign: 'center',
        margin: Metrics.baseMargin,
        paddingHorizontal: Metrics.baseMargin,
      },
      modalMainButton: {
        margin: 10,
        backgroundColor: Colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        width: 240,
        height: 50,
        borderRadius: 25,
      },
      secondActionText: {
        margin: Metrics.baseMargin,
        color: Colors.grey,
        fontFamily: Fonts.type.base,
        fontSize: Fonts.size.normal,
      },
      modalButton: {
        paddingVertical: Metrics.baseMargin,
        alignItems: 'center',
        paddingHorizontal: 30,
      },
      modalCancelButton: {
        margin: 10,
      },
      actionConfirmText: {
        color: 'white',
        fontFamily: Fonts.type.bold,
        fontSize: 16,
        textTransform: 'uppercase',
      },
      actionCancelText: {
        color: Colors.grey,
        fontFamily: Fonts.type.base,
        fontSize: 16,
      },
      imgContainer: {
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: 'white',
      },
      imgContainerInner: {
        backgroundColor: Colors.green,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchInput: {
        width: 200,
        backgroundColor: 'transparent',
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: Fonts.type.bold,
        fontSize: 42,
        color: Colors.text,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 20,
      },
    });
  }
}
