import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useDispatch, useSelector} from 'react-redux';
import R from 'ramda';
import moment from 'moment';

import buttonStylesFactory from '../../../Components/Styles/ButtonStyle';
import stylesfactory from '../../Styles/MapSelectionStyle';
import {Images, Colors, Fonts} from '../../../Themes';
import {PackagesSelection} from './PackagesSelection';
import I18n from 'i18n-js';
import BeachSpotActions from '../../../Redux/BeachSpotRedux';
import Spinner from 'react-native-loading-spinner-overlay';

export const MapSelection = ({navigation}) => {
  const dispatch = useDispatch();

  const [selectedPlacements, setSelectedPlacement] = useState([]);

  const modalRef = useRef(null);

  const buttonStyles = buttonStylesFactory.getSheet();
  const styles = stylesfactory.getSheet();

  const {selectedDates} = navigation.state.params;

  const datesKeys = Object.keys(selectedDates);
  console.log('sdclsdn ', datesKeys[0]);

  const startingDate = moment(datesKeys[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
  // eslint-disable-next-line prettier/prettier
  const endingDate = moment(
    datesKeys[datesKeys.length - 1],
    'YYYY-MM-DD',
  ).format('DD-MM-YYYY');
  const startingD = moment(datesKeys[0], 'YYYY-MM-DD').format('D MMM');
  const endingD = moment(datesKeys[datesKeys.length - 1], 'YYYY-MM-DD').format(
    'D MMM',
  );
  const check = endingD == startingD ? '' : endingD;

  const beachSpot = useSelector(state => state.beachSpots?.current?.data);
  const placementsStatus = useSelector(
    state => state.beachSpots?.current?.placementsStatus,
  );
  const [placementsBusy, setplacementsBusy] = useState([]);

  useEffect(() => {
    dispatch(
      BeachSpotActions.getPlacementsStatusRequest({
        beachSpotId: beachSpot.id,
        startingDate,
        endingDate,
      }),
    );
  }, [beachSpot.id, dispatch, endingDate, startingDate]);

  useEffect(() => {
    if (Array.isArray(placementsStatus?.data)) {
      setplacementsBusy(placementsStatus.data.flatMap(ps => ps.placements));
    }
  }, [placementsStatus]);

  const renderPlacement = placement => {
    const isSelected = R.includes(placement.id, selectedPlacements);
    const isBooked = placementsBusy.includes(placement.id);
    return (
      <TouchableOpacity
        style={[
          styles.spotContainer,
          {
            backgroundColor: isBooked
              ? Colors.bookOrange
              : isSelected
              ? Colors.titleBlue
              : 'white',
          },
        ]}
        key={placement.id}
        onPress={() => {
          const updatedPlacements = isBooked
            ? R.without([placement.id], selectedPlacements)
            : isSelected
            ? R.without([placement.id], selectedPlacements)
            : R.append(placement.id, selectedPlacements);

          setSelectedPlacement(updatedPlacements);
        }}>
        <Text
          style={[
            styles.spotText,
            {color: isSelected || isBooked ? 'white' : Colors.titleBlue},
          ]}>
          {placement.number}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = row => {
    // id: 175
    // name: null
    // number: 1
    // placements

    return (
      <View style={styles.row} key={row.id}>
        {row.placements.map(el => renderPlacement(el))}
      </View>
    );
  };

  const renderSector = sector => {
    // description: null
    // id: 26
    // name: "A"
    // position_x: 0
    // position_y: 232
    // sector_rows
    return (
      <View
        style={[
          styles.sector,
          {
            top: sector.position_y,
            left: sector.position_x + 10,
          },
        ]}>
        <Text>{sector.name}</Text>
        <View>{sector.sector_rows.map(el => renderRow(el))}</View>
      </View>
    );
  };

  const renderBottomBar = () => (
    <View style={styles.bottomContainer}>
      <Text style={styles.infoRowTitle}>{I18n.t('placements_confirm')}</Text>
      <TouchableOpacity
        style={[buttonStyles.buttonActiveBig]}
        onPress={() => {
          modalRef?.current?.open();
        }}
        disabled={selectedPlacements.length === 0}>
        <Text style={[buttonStyles.titleActive, {fontFamily: Fonts.type.bold}]}>
          {I18n.t('reportAlert_confirm')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.spotsContainer}>
        <Image
          source={Images.beachBG}
          style={{width: '100%', position: 'absolute'}}
          resizeMode="contain"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              minHeight: 10000,
              minWidth: 10000,
            }}>
            {beachSpot.sectors.map(s => renderSector(s))}
          </View>
        </ScrollView>
      </ScrollView>
      <SafeAreaView style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconIonicon
            size={30}
            name={'ios-arrow-back'}
            style={{
              color: 'white',
              textAlign: 'center',
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
        <View style={{position: 'absolute', left: 110}}>
          <Text style={styles.title}>{I18n.t('placements_title')}</Text>
          <Text>
            <Text style={styles.title}>
              {startingD} - {check}
            </Text>
            <Text style={{color: 'white'}}> tutto il giorno</Text>
          </Text>
        </View>
      </SafeAreaView>
      {renderBottomBar()}
      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="inside"
          adjustToContentHeight
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <PackagesSelection
            ref={modalRef}
            navigation={navigation}
            beachSpot={beachSpot}
            placements={selectedPlacements}
            startingDate={startingDate}
            endingDate={endingDate}
          />
        </Modalize>
      </Portal>
      {placementsStatus?.isFetching && (
        <Spinner
          cancelable={false}
          visible
          textContent=""
          textStyle={{color: 'white'}}
        />
      )}
    </View>
  );
};
