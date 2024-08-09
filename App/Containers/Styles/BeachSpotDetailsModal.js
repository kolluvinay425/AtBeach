// @flow

import {Platform, StyleSheet} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

import {ApplicationStyles, Metrics, Colors, Fonts} from '../../Themes';

const isIPhoneX = isIphoneX();
const isIOS = Platform.OS === 'ios';

export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      ...ApplicationStyles.screen,
      outerContainer: {
        flex: 1,
        backgroundColor: Colors.lightestgrey,
      },
      innerContainer: {
        padding: Metrics.doubleBaseMargin,
        paddingBottom: 0,
        borderRadius: 20,
        backgroundColor: Colors.lightestgrey,
        marginTop: -20,
      },
      bottomContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: Metrics.windowWidth,
        padding: Metrics.doubleBaseMargin,
        paddingBottom: isIOS
          ? isIPhoneX
            ? Metrics.doubleBaseMargin + 20
            : Metrics.doubleBaseMargin
          : Metrics.doubleBaseMargin,
        elevation: 24,
        borderTopColor: 'rgba(51,51,51,0.10)',
        borderTopWidth: 1,
      },
      buttomContainerOne: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
      },
      bottomContainerTwo: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
      },
      textContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
      },
      bottomText: {
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.light,
        color: Colors.lightTextReadable,
        textAlign: 'left',
      },
      bottomTextOne: {
        fontSize: Fonts.size.h5,
        fontFamily: Fonts.type.regular,
        textAlign: 'left',
        textTransform: 'capitalize',
      },
      bottomContainerOne: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
      },
      bottomTextTwo: {
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.light,
        color: Colors.lightTextReadable,
      },
      OIcon: {
        padding: 0,
        margin: 0,
        marginBottom: 2,
        color: Colors.pinYellow,
        marginRight: 3,
      },
      OIconTwo: {
        padding: 0,
        margin: 0,
        marginBottom: 2,
        color: Colors.lightTextReadable,
        marginRight: 3,
      },
      startingPriceContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: Colors.lightgreyBorder,
        paddingHorizontal: 20,
      },
      navbarContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Metrics.doubleBaseMargin,
        paddingTop: isIOS
          ? isIPhoneX
            ? Metrics.navBarOverStatusPaddingTop + Metrics.baseMargin
            : Metrics.navBarOverStatusPaddingTop + Metrics.doubleBaseMargin
          : Metrics.doubleBaseMargin,
        backgroundColor: Colors.navbarTrasparent,
      },
      navbarElement: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderRadius: 50,
        marginLeft: 15,
      },
      navbarElementIcon: {
        color: Colors.text,
        textAlign: 'center',
        height: 25,
        width: 25,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingRight: 0,
      },
      infoContainer: {
        padding: 20,
        paddingHorizontal: 25,
      },
      infoTitle: {
        fontSize: Fonts.size.title,
        fontFamily: Fonts.type.bold,
        color: Colors.text,
        letterSpacing: 0.5,
        marginBottom: 10,
      },
      infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
      },
      infoRowImage: {
        width: 40,
        height: 40,
        marginRight: 10,
      },
      infoRowTitle: {
        color: Colors.text,
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.base,
        fontWeight: '600',
        marginBottom: 5,
      },
      infoRowMessage: {
        color: Colors.lightTextReadable,
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.base,
      },
      serviceText: {
        color: Colors.text,
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.base,
        marginVertical: 7,
      },
    });
  }
}
