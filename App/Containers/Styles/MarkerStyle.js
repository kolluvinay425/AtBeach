import {StyleSheet} from 'react-native';
import metrics from '../../Themes/Metrics';
import {Colors, Fonts} from '../../Themes';

export const markerstyles = StyleSheet.create({
  Markercontainer: {
    backgroundColor: Colors.pinGroup,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    minHeight: 30,
    minWidth: 30,
    borderColor: Colors.white,
    borderRadius: 100,
  },
  Markertext: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  container: {
    width: metrics.windowWidth,
  },
  content: {
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: Colors.lightestgrey,
    borderWidth: 0.5,
  },
  text: {
    fontFamily: Fonts.type.bold,
    fontSize: 10,
    color: Colors.text,
    paddingVertical: 4,
    paddingHorizontal: 15,
  },
});
