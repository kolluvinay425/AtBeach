import {StyleSheet} from 'react-native';
import Fonts from '../../Themes/Fonts';
import metrics from '../../Themes/Metrics';
import {RFValue} from 'react-native-responsive-fontsize';
import {isIphoneX} from 'react-native-iphone-x-helper';

export const onboardingstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: Fonts.type.base,
    fontSize: RFValue(20),
    lineHeight: 30,
    fontWeight: 'bold'
  },
  textWrapper: {
    position: 'absolute',
    width: metrics.windowWidth,
    height: 300,
    padding: 30,
    bottom: isIphoneX() ? 20 : 0,
    // bottom: 100
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 130
  },
  viewTitle: {
    marginBottom: 20
    // height: 30,
    // left: 20,
    // bottom: 260,
  },
  desc: {
    color: '#FFFFFF',
    fontFamily: Fonts.type.base,
    // fontWeight: 400,
    // lineHeight: 150,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    fontSize: RFValue(14),
    textShadowRadius: 10,
  },
  viewDescription: {
    // left: 20,
    // bottom: 260,
    // color: '#FFFFFF',
  },
  skipImage: {
    width: 21.21,
    height: 21.21,
    color: 'rgba(255, 255, 255, 1)',
  },
  skip: {
    position: 'absolute',
    right: 30,
    top: 23.48,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: 'rgba(255,255,255, 1)',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    backgroundColor: '#FF3B5F',
    color: '#FFFFFF',
    height: 50,
    borderRadius: 99,
    width: 170,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
