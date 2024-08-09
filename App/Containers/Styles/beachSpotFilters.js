import {StyleSheet} from 'react-native';
import metrics from '../../Themes/Metrics';
import {Colors, Fonts} from '../../Themes';

export const filterStyles = StyleSheet.create({
  container: {
    // flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'auto',
    marginTop: 0,
  },
  Iconcontainer: {
    // height: 80,
    width: 'auto',
    marginHorizontal: 13,
    marginLeft: 0,
    marginRight: 30,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 10,
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    fontFamily: Fonts.type.bold,
    color: '#666262',
    padding: 5,
  },
  textHeading: {
    fontSize: Fonts.size.h6,
    fontFamily: Fonts.type.bold,
    color: 'black',
    // marginTop: 15
  },
});
