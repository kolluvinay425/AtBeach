import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes';
export const capacityStyle = StyleSheet.create({
  bottomButtomContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  capacityContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 18
  },
  capacityText1: {
    color: Colors.lightTextReadable,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.base,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    justifyContent: 'space-between',
    flex: 1
  },
  capacityText2: {
    color: Colors.text,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    marginTop: 0,
    flex: 2
  },
  municipalityInfoContainer: {
    borderRadius: 20,
    backgroundColor: Colors.sukinoGrey,
    marginTop: 10,
    paddingTop: 40,
    marginBottom: 20,
  },
  municipalityInfoText: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: Fonts.type.bold,
    textAlign: 'center',
    marginBottom: 5,
  },
  view: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
  },
});
