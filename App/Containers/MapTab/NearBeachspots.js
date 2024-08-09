import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native';
import {CAROUSEL_WIDTH, CARD_WIDTH, CARD_MARGIN} from './MapScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {getBeachSpotImageUrl} from '../../Lib/Utilities';
import {Colors, Fonts} from '../../Themes';
import {StyleSheet} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import BeachSpotActions from '../../Redux/BeachSpotRedux';

const descStyle = StyleSheet.create({
  descMargin: {
    marginLeft: 5,
    marginTop: 20,
    // marginBottom: 20,
  },
  textStyle: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    color: Colors.text,
    marginBottom: 7,
    letterSpacing: 0.5,
    marginTop: 0,
  },
  color: {
    color: Colors.pinRed,
  },

  localtyContainer: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  text: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.base,
    color: Colors.lightTextReadable,
  },
});
function NearBeachspots({beaches, showDetails}) {
  const state = beaches;
  const dispatch = useDispatch();
  const updateNearSpots = item => {
    dispatch(
      BeachSpotActions.getNearbyBeachSpotsRequest({
        latitude: item.latitude,
        longitude: item.longitude,
        limit: 10,
        sea_id: item.sea_id,
        around_beach_spot: true,
      }),
    );
  };
  const _keyExtractor = (item, i) => i.toString();
  return (
    <>
      <View style={descStyle.descMargin}>
        <Text style={descStyle.textStyle}>
          Ti potrebbero interessare li vicino
        </Text>
      </View>

      <FlatList
        bounces={false}
        horizontal
        data={state}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        ref={c => {
          carousel = c;
        }}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              updateNearSpots(item);
              showDetails(item);
            }}
            style={{
              borderRadius: 16,
              width: 150,
              margin: CARD_MARGIN,
              backgroundColor: '#FFFFFF',
              shadowColor: '#000000',
              shadowOpacity: 0.2,
              shadowRadius: 3,
              shadowOffset: {
                height: 0,
                width: 0,
              },
              elevation: 3,
              // opacity: item.isVisible ? 1 : 0.4,
              // backgroundColor: item.isVisible ? 'white' : Colors.lightestgrey,
              height: 250,
            }}>
            <FastImage
              style={{
                marginTop: 10,
                height: 130,
                width: 130,
                borderRadius: 16,
                alignSelf: 'center',
                marginBottom: 2,
              }}
              source={getBeachSpotImageUrl(item)}
            />
            <View style={descStyle.localtyContainer}>
              <View style={descStyle.textContainer}>
                <IconFeather
                  name={'map-pin'}
                  color={Colors.lightTextReadable}
                  size={14}
                  style={{
                    marginRight: 6,
                  }}
                />
                <Text style={descStyle.text}>{item.locality}</Text>
              </View>
            </View>
            <View style={{marginLeft: 8}}>
              <Text style={[descStyle.textStyle]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        containerWidth={CAROUSEL_WIDTH}
      />
    </>
  );
}

export default NearBeachspots;
