// @flow

import React from 'react';
import {View, Text} from 'react-native';

import {Metrics, Colors, Fonts} from '../../Themes';
import {StyleSheet} from 'react-native';
export const Title = ({beachSpot, rightComponent}) => {
  return (
    <View style={titleStyle.container}>
      <View style={titleStyle.textContainer}>
        <Text style={titleStyle.text}>{beachSpot.name}</Text>
      </View>
      { rightComponent && (
        <View style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'flex-end',
          flex: 1,
        }}>
          {rightComponent}
        </View>
      ) }
    </View>
  );
};
const titleStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignContent: 'flex-start',
    marginBottom: 10,
    marginRight: 10
  },
  textContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // height: 1000,
    // alignContent: 'flex-end',
    flexDirection: 'row'
  },
  text: {
    color: Colors.titleBlue,
    fontSize: Fonts.size.h4,
    fontFamily: Fonts.type.bold,
    // lineHeight: 10
  },
});
