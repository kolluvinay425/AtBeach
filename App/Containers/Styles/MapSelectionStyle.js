// @flow

import {Platform, StyleSheet} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

import {Fonts, Metrics, Colors} from '../../Themes';

const isIPhoneX = isIphoneX();
const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgb(253, 239, 220)',
      },
      titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Metrics.doubleBaseMargin,
        position: 'absolute',
      },
      title: {
        width: 'auto',
        color: 'white',
        fontFamily: Fonts.type.bold,
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
      },
      spotsContainer: {},
      spotContainer: {
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        flexDirection: 'row',
      },
      spotText: {
        color: Colors.titleBlue,
        fontFamily: Fonts.type.bold,
        fontSize: 14,
        textAlign: 'center',
      },
      row: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      sector: {
        position: 'absolute',
        alignItems: 'center',
      },
      bottomContainer: {
        backgroundColor: 'white',
        width: Metrics.windowWidth,
        padding: Metrics.doubleBaseMargin,
        paddingBottom: isIPhoneX
          ? Metrics.doubleBaseMargin + 15
          : Metrics.doubleBaseMargin,
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1,
        },
        elevation: 24,
        borderTopColor: 'rgba(51,51,51,0.10)',
        borderTopWidth: isIOS ? 0 : 1,
      },
      infoRowTitle: {
        color: Colors.text,
        fontSize: Fonts.size.medium,
        fontFamily: Fonts.type.base,
        marginBottom: 15,
        textAlign: 'center',
      },
    });
  }
}
