import {setMarkerRef, markersRef} from '../../Lib/MapService';
import {Callout, Marker} from 'react-native-maps';
import React, {Component, useState} from 'react';
import {pMarkerStyles} from '../Styles/PMarkerStyle';
import {useRef} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
// const OIcon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf');
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import moment from 'moment';
import {navigateTo} from '../../Lib/Utilities';
import {Colors, Fonts, Metrics} from '../../Themes';
import PMarkerModal from './PMarkerModal';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {isIos} from 'react-native-modalize/lib/utils/devices';
import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
import {OIcon} from './BeachSpotSearch/Macros';
export const PMarker = ({data}) => {
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const modalizeRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const showModal = state => {
    setIsModalOpen(state);
  };
  const {
    id,
    name,
    capacity,
    latitude,
    longitude,
    from_day_hour,
    to_day_hour,
    price_weekday_hour,
    price_weekday_day,
    price_weekend_hour,
    price_weekend_day,
    has_shuttle,
  } = data

  console.log(data)

  return (
    <>
      <Marker
        onPress={onOpen}
        coordinate={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }}
        ref={ref => {
          setMarkerRef(id, ref);
        }}
        tracksViewChanges={false}
        tracksInfoWindowChanges={false}
        key={id}>
        {/*<OIcon color={Colors.teal} size={40} name="pin01" />*/}
        {/* <FontAwesome5 name="parking_icon" size={30} /> */}
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
            <OIcon
              name={'tag_parking_free'}
              color={Colors.blueText}
              size={18}
            />
          </Text>
        </View>
        <Callout
          tooltip={true}
          onPress={() => {
            navigateTo(latitude, longitude);
          }}>
          {/* <View style={pMarkerStyles.container}>
            <View style={pMarkerStyles.content}>
              <Text style={pMarkerStyles.textTitle}>{name}</Text>
              <Text style={pMarkerStyles.text}>
                Capienza: {capacity} Posti
              </Text>
              {from_day_hour && (
                <View>
                  <Text style={pMarkerStyles.text}>
                    Dal {moment(from_day_hour).format('DD/MM')} al{' '}
                    {moment(to_day_hour).format('DD/MM')}
                  </Text>
                  <Text style={pMarkerStyles.text}>
                    Orari: {moment(from_day_hour).format('HH:mm')} -{' '}
                    {moment(to_day_hour).format('HH:mm')}
                  </Text>
                </View>
              )}
              {(price_weekday_hour || price_weekday_day) && (
                <View>
                  <Text style={pMarkerStyles.textTitle}>
                    Tariffe giorni feriali
                  </Text>
                  <Text style={pMarkerStyles.text}>
                    {price_weekday_hour && `Oraria: ${price_weekday_hour} - `}
                    {price_weekday_day && `Giornaliera: ${price_weekday_day}`}
                  </Text>
                </View>
              )}
              {(price_weekend_hour || price_weekend_day) && (
                <View>
                  <Text style={pMarkerStyles.textTitle}>
                    Tariffe giorni festivi
                  </Text>
                  <Text style={pMarkerStyles.text}>
                    {price_weekend_hour && `Oraria: ${price_weekend_hour} - `}
                    {price_weekend_day && `Giornaliera: ${price_weekend_day}`}
                  </Text>
                </View>
              )}
              {has_shuttle && (
                <Text style={pMarkerStyles.textTitle}>
                  Servizio navetta presente
                </Text>
              )}
              <Text
                style={[
                  pMarkerStyles.text,
                  {
                    marginVertical: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    color: 'white',
                    alignSelf: 'center',
                    backgroundColor: Colors.activeButton,
                    borderRadius: 10,
                  },
                ]}>
                {' '}
                PORTAMI AL PARCHEGGIO{' '}
              </Text>
            </View>
          </View> */}
        </Callout>
      </Marker>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
          scrollViewProps={{
            keyboardShouldPersistTaps: 'always',
            showsVerticalScrollIndicator: false,
            bounces: true,
          }}
          FooterComponent={() => (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigateTo(latitude, longitude);
                }}
                style={styles.footerButton}>
                <Text style={styles.footerText}>Vai al parcheggio</Text>
              </TouchableOpacity>
            </View>
          )}>
          <View style={styles.container}>
            <View style={styles.heading}>
              <View>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: Fonts.size.small,
                    fontFamily: Fonts.type.bold,
                    letterSpacing: 0.5,
                    color: '#0070CA',
                    width: metrics.windowWidth / 2,
                  }}>
                  {name}
                </Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
                  <ImageBackground
                    style={{
                      height: 20,
                      width: 20,
                    }}
                    source={images.skip}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {from_day_hour && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      paddingBottom: 5,
                      fontSize: Fonts.size.medium,
                      fontFamily: Fonts.type.bold,
                    }}>
                    Orari di apertura
                  </Text>
                  <Text
                    style={{
                      fontSize: Fonts.size.medium,
                      fontFamily: Fonts.type.base,
                      letterSpacing: 0.5,
                      color: 'grey',
                    }}>
                    Dal {moment(from_day_hour).format('DD/MM')} al{' '}
                    {moment(to_day_hour).format('DD/MM')}
                  </Text>
                  <Text
                    style={{
                      fontSize: Fonts.size.medium,
                      fontFamily: Fonts.type.base,
                      letterSpacing: 0.5,
                      color: 'grey',
                    }}>
                    Orari: {moment(from_day_hour).format('HH:mm')} -{' '}
                    {moment(to_day_hour).format('HH:mm')}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>
                    <FontAwesome5
                      name="rainbow"
                      style={{color: 'skyblue'}}
                      size={20}
                    />
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.type.bold,
                      fontSize: Fonts.size.medium,
                      letterSpacing: 0.5,
                    }}>
                    Vuoto
                  </Text>
                  <Text style={{bottom: 2}}>
                    <Text
                      style={{
                        fontFamily: Fonts.type.bold,
                        fontSize: Fonts.size.normal,
                        letterSpacing: 0.5,
                      }}>
                      {capacity}
                    </Text>{' '}
                    <Text
                      style={{
                        fontFamily: Fonts.type.base,
                        fontSize: Fonts.size.small,
                        letterSpacing: 0.5,
                      }}>
                      posti
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.type.base,
                      fontSize: Fonts.size.small,
                      letterSpacing: 0.5,
                      color: '#5B5B5B',
                      bottom: 7,
                    }}>
                    capienza
                  </Text>
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 8,
              }}>
              <View>
                <Text
                  style={{
                    paddingBottom: 5,
                    fontSize: Fonts.size.medium,
                    fontFamily: Fonts.type.bold,
                    letterSpacing: 0.5,
                  }}>
                  Costi e tariffe
                </Text>
                <Text
                  style={{
                    fontSize: Fonts.size.medium,
                    fontFamily: Fonts.type.base,
                    letterSpacing: 0.5,
                    color: 'grey',
                  }}>
                  {price_weekday_day && `Feriale: ${price_weekday_day}/g`}
                  {price_weekday_hour && ` - ${price_weekday_hour}/h`}
                </Text>
                <Text
                  style={{
                    fontSize: Fonts.size.medium,
                    fontFamily: Fonts.type.base,
                    letterSpacing: 0.5,
                    color: 'grey',
                  }}>
                  {price_weekend_day && `Festivi: ${price_weekend_day}/g` }
                  {price_weekend_hour && ` - ${price_weekend_hour}/h`}
                </Text>
              </View>
              {has_shuttle && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>
                    <FontAwesome5 name="bus" size={20} />
                  </Text>
                  <Text
                    style={{
                      fontSize: Fonts.size.small,
                      fontFamily: Fonts.type.bold,
                      letterSpacing: 0.5,
                      color: '#5B5B5B',
                    }}>
                    Navetta
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: Metrics.doubleBaseMargin,
    paddingBottom: isIos
      ? isIphoneX
        ? Metrics.doubleBaseMargin + 20
        : Metrics.doubleBaseMargin
      : Metrics.doubleBaseMargin,
    elevation: 24,
    borderTopColor: 'rgba(51,51,51,0.10)',
    borderTopWidth: 1,
  },
  footerButton: {
    height: 60,
    backgroundColor: '#0070CA',
    width: '75%',
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.base,
    color: 'white',
    marginLeft: 10,
    fontWeight: '800',
  },
});
