// @flow

import React, {useEffect, useState} from 'react';
import {PanResponder, View, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import OMarker from '../../Containers/MapTab/Marker';
import {PMarker} from '../../Containers/MapTab/PMarker';

import {Colors, Metrics} from '../../Themes';
import {navigateTo} from '../../Lib/Utilities';
import {mapStyle} from '../../Containers/Styles/MapScreenStyle';
import {findGpsCenter} from '../../Lib/MapService';
import IconFeather from 'react-native-vector-icons/dist/Feather';

export const Map = ({beachSpot}) => {
  let center = {
    lat: parseFloat(beachSpot.latitude),
    lng: parseFloat(beachSpot.longitude),
  };
  const markers = [center];
  if (beachSpot.parking_spots) {
    beachSpot.parking_spots.forEach(ps => {
      markers.push({
        lat: parseFloat(ps.latitude),
        lng: parseFloat(ps.longitude),
      });
    });
    center = findGpsCenter(markers);
  }

  const latdelta =
    Math.abs(markers.reduce((partialSum, a) => partialSum - a.lat, 0)) / 1000;
  const lngdelta =
    Math.abs(markers.reduce((partialSum, a) => partialSum - a.lng, 0)) / 1000;

  const elements = markers.length;

  // const [scrollEnabled, setScrollEnabled] = useState(false);
  // const [panHandlers, setPanHandlers] = useState({});
  // useEffect(() => {
  //   const panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: (evt, gestureState) => true,
  //     onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
  //     onMoveShouldSetPanResponder: (evt, gestureState) => true,
  //     onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
  //     onShouldBlockNativeResponder: (evt, gestureState) => false,
  //     onPanResponderGrant: (event, gesture) => {
  //       // console.log('1')
  //       setScrollEnabled(gesture.numberActiveTouches === 2)
  //     },
  //     onPanResponderMove: (event, gesture) => {
  //       // console.log('2')
  //       setScrollEnabled(gesture.numberActiveTouches === 2)
  //     },
  //     onPanResponderRelease: (event, gesture) => {
  //       // console.log('RELEASE')
  //       setScrollEnabled(false);
  //     },
  //     onPanResponderStart: (event, gesture) => {
  //       // console.log('4')
  //       setScrollEnabled(gesture.numberActiveTouches === 2)
  //     }
  //   });
  //   setPanHandlers(panResponder.panHandlers);
  // }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', marginVertical: 10}}>
      <MapView
        key={elements}
        scrollEnabled={true}
        customMapStyle={mapStyle}
        fitToElements={true}
        fitToSuppliedMarkers={true}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          width: Metrics.windowWidth - 40,
          height: 270,
          borderRadius: 8,
        }}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: latdelta,
          longitudeDelta: lngdelta,
        }}
        // onPress={() => navigateTo(beachSpot.latitude, beachSpot.longitude)}
        showsMyLocationButton={false}
        loadingEnabled={false}
        showsPointsOfInterest={false}>
        {/* <OMarker
          beachSpot={beachSpot}
          onMarkerPress={() => {
          }}
          pinIcon={'pin02'}
        /> */}
        <Marker
          coordinate={{
            latitude: parseFloat(beachSpot.latitude),
            longitude: parseFloat(beachSpot.longitude),
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: 'white',
              height: 30,
              width: 30,
              shadowColor: '#000000',
              shadowOpacity: 0.2,
              shadowRadius: 3,
              shadowOffset: {
                height: 0,
                width: 0,
              },
              elevation: 3,
              marginHorizontal: 2,
            }}>
            <Text
              style={{
                padding: 0,
              }}>
              <IconFeather
                name={'map-pin'}
                color={Colors.blueText}
                size={18}
                style={{
                  marginRight: 5,
                }}
              />
            </Text>
          </View>
        </Marker>
        {beachSpot.parking_spots?.map(p => <PMarker data={p} />)}
      </MapView>
    </View>
  );
};
