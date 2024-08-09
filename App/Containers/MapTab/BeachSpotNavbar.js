import React from 'react';
import {View, TouchableOpacity, Animated, Platform} from 'react-native';
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import I18n from 'i18n-js';

import BeachSpotActions from '../../Redux/BeachSpotRedux';
import stylesfactory from '../Styles/BeachSpotDetailsModal';
import {share, navigateTo} from '../../Lib/Utilities';
import {Colors, Metrics} from '../../Themes';
import {useState} from 'react';
import {isIphoneX} from 'react-native-iphone-x-helper';

const isIPhoneX = isIphoneX();
const isIOS = Platform.OS === 'ios';

export const BeachSpotNavbar = ({beachSpot, onBack}) => {
  // const [addOrRemoveFav, setAddOrRemoveFav] = useState(false);
  const styles = stylesfactory.getSheet();

  const dispatch = useDispatch();
  const favBeachSpots = useSelector(s => s.beachSpots.favorites);

  const addBeachSpotFavorite = id => dispatch(BeachSpotActions.addBeachSpotFavorite(id));
  const removeBeachSpotFavorite = id => dispatch(BeachSpotActions.removeBeachSpotFavorite(id));
  const check = beachSpot && favBeachSpots.find(id => id === beachSpot.id);
  const onFavoritePress = () => {

    if (beachSpot) {
      if (check) {
        removeBeachSpotFavorite(beachSpot.id);
        showMessage({
          message: I18n.t('unsavedSuccess'),
          description: I18n.t('unsavedSuccessMessage', {beachSpotName: beachSpot.name}),
          type: 'success',
          backgroundColor: Colors.pinGreen,
        });
      } else {
        addBeachSpotFavorite(beachSpot.id);
        showMessage({
          message: I18n.t('savedSuccess'),
          description: I18n.t('savedSuccessMessage', {beachSpotName: beachSpot.name}),
          type: 'success',
          backgroundColor: Colors.pinGreen,
        });
      }
    }
  };

  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingRight: Metrics.doubleBaseMargin}}>
      <TouchableOpacity
        style={styles.navbarElement}
        onPress={() => {
          navigateTo(beachSpot.latitude, beachSpot.longitude);
        }}>
        <IconIonicon
          size={25}
          name={'md-navigate'}
          style={styles.navbarElementIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarElement} onPress={() => {share(beachSpot.latitude, beachSpot.longitude, beachSpot.name)}}>
        <SimpleLineIcons
          size={22}
          name={'share-alt'}
          style={styles.navbarElementIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navbarElement}
        onPress={onFavoritePress}>
        <MaterialIcon
          size={25}
          name={check ? 'heart' : 'heart-outline'}
          style={[styles.navbarElementIcon, {color: check ? Colors.activeButton : Colors.text}]}
        />
      </TouchableOpacity>
    </View>
  );
};
