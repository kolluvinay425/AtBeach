import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes';
export const pMarkerStyles = StyleSheet.create({
  container: {
    width: (Metrics.windowWidth / 4) * 3,
  },
  content: {
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: Colors.lightestgrey,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 8,
  },
  textTitle: {
    fontFamily: Fonts.type.bold,
    fontSize: 10,
    color: Colors.text,
    paddingVertical: 4,
    paddingHorizontal: 15,
  },
  text: {
    fontFamily: Fonts.type.base,
    fontSize: 10,
    color: Colors.text,
    paddingHorizontal: 15,
  },
});
