// @flow

import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import I18n from 'i18n-js';
import moment from 'moment';
import R from 'ramda';
import {StyleSheet} from 'react-native';
import {Metrics, Fonts, Colors} from '../../Themes';
import WeatherForecast from '../WeatherForecast';
import WeatherForecastsModal from '../../Containers/MapTab/WeatherForecastsModal';

export const Weather = ({beachSpot}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (
    !beachSpot.last_weather_info ||
    R.isEmpty(beachSpot.last_weather_info?.stg)
  ) {
    return null;
  }

  return (
    <View style={{marginBottom: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={weatherStyle.textStyle}>Meteo e previsioni</Text>
        <View style={weatherStyle.textContainer}>
          <Text style={weatherStyle.text}>
            {I18n.t('weatherForecast_updatedAt', {
              time: moment(beachSpot.last_weather_info.updated_at).format(
                'HH:MM DD/MM/YY',
              ),
            })}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <WeatherForecast
          style={weatherStyle.WeatherForecast}
          showArrow
          lastWeatherInfo={beachSpot.last_weather_info.stg}
        />
      </TouchableOpacity>
      <WeatherForecastsModal
        beachSpotId={beachSpot.id}
        isVisible={isModalVisible}
        closeHandler={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const weatherStyle = StyleSheet.create({
  WeatherForecast: {
    margin: 0,
    marginLeft: 0,
    paddingBottom: Metrics.doubleBaseMargin,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: 'white',
  },
  textContainer: {
    marginTop: 10,
    marginBottom: 15,
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: Fonts.size.tiny,
    color: Colors.grey,
  },
  textStyle: {
    flexShrink: 1,
    textAlign: 'left',
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 7,
    letterSpacing: 0.5,
  },
});
