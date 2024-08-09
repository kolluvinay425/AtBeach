import React, {useRef, forwardRef, useEffect} from 'react';
import {
  ScrollView,
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import BeachSpotActions from '../../../Redux/BeachSpotRedux';
import {Images, Colors, Fonts} from '../../../Themes';
import stylesfactory from '../../Styles/ReservationModalStyle';
import I18n from 'i18n-js';
import IconFeather from 'react-native-vector-icons/dist/Feather';

export const PackagesSelection = forwardRef(
  ({navigation, beachSpot, placements, startingDate, endingDate}, modalRef) => {
    const dispatch = useDispatch();

    const styles = stylesfactory.getSheet();
    const packages = useSelector(state => state.beachSpots?.order?.packages);

    useEffect(() => {
      dispatch(
        BeachSpotActions.getOrderPackagesRequest({
          beachSpotId: beachSpot.id,
          placements: placements.join('-'),
          startingDate,
          endingDate,
        }),
      );
    }, [beachSpot.id, dispatch, endingDate, placements, startingDate]);

    const onPackageSelection = packageData => {
      dispatch(
        BeachSpotActions.getOrderLockRequest(
          {
            beachSpotId: beachSpot.id,
            placements: placements.join('-'),
            startingDate,
            endingDate,
            packageId: packageData.package.id,
          },
          () => {
            modalRef?.current?.close();
            navigation.navigate({
              routeName: 'BeachSpotReservationSummary',
              params: {
                beachSpot,
                startingDate,
                endingDate,
                packageData,
                placements,
              },
            });
          },
          () => {
            modalRef?.current?.close();
            dispatch(
              BeachSpotActions.getPlacementsStatusRequest({
                beachSpotId: beachSpot.id,
                startingDate,
                endingDate,
              }),
            );
            Alert.alert(
              'Per un pelo!',
              "Una o più postazioni selezionate sono state appena prenotate!\nProva con un'altra.",
            );
          },
        ),
      );
    };
    const renderEquipments = p => {
      const equipments = [];
      const count = {};
      p.package.equipments.forEach((element, index) => {
        if (count[element]) {
          count[element]++;
        } else {
          count[element] = 1;
        }
      });
      for (const [key, value] of Object.entries(count)) {
        value > 1
          ? equipments.push(value + ' ', key + ' + ')
          : equipments.push(key + ' + ');
      }
      const check = equipments.length > 0;
      const removeLastItem = check
        ? equipments[equipments.length - 1].slice(
            0,
            equipments[equipments.length - 1].length - 2,
          )
        : null;
      equipments.pop();
      equipments.push(removeLastItem);
      console.log('equipments', equipments);
      return equipments.map(el => (
        <Text style={styles.packageTitle}>{el}</Text>
      ));
    };
    const renderPackage = packageData => {
      return (
        <TouchableOpacity
          key={packageData.package.id}
          style={styles.packageContainer}
          onPress={() => onPackageSelection(packageData)}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {renderEquipments(packageData)}
            {/* {packageData.package.equipments.map(el => (
              <Text style={styles.packageTitle}>{`${el} `}</Text>
            ))} */}
          </View>

          <View style={[styles.packageTitle, {flexDirection: 'row'}]}>
            <IconFeather
              name={'users'}
              color={'black'}
              size={20}
              style={{
                marginRight: 5,
              }}
            />
            <Text style={styles.packageMessage}>
              {I18n.t('packages_people', {
                people: packageData.package.persons,
              })}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <Text style={styles.packagePrice}>
              {packageData.computed_price}€
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{paddingTop: 40}}>
        <Text style={styles.packageModalTitle}>{I18n.t('packages_title')}</Text>
        {packages?.isFetching ? (
          <Spinner
            cancelable={false}
            visible
            textContent=""
            textStyle={{color: 'white'}}
          />
        ) : (
          <View style={styles.packageModalContent}>
            {packages?.data?.packages_costs?.map(p => renderPackage(p))}
          </View>
        )}
      </View>
    );
  },
);
