// @flow

import React from 'react';
import {View, Text} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';

import {Colors, Fonts} from '../../Themes';
import {StyleSheet} from 'react-native';

const localtyStyle = StyleSheet.create({
  localtyContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2
  },
  text: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.base,
    color: Colors.lightTextReadable,
    // width: '80%'
    // lineHeight: 10
  },
});
export const Locality = ({beachSpot, rightComponent}) => {
  return (
    <View style={localtyStyle.localtyContainer}>
      <View style={localtyStyle.textContainer}>
        <IconFeather
          name={'map-pin'}
          color={Colors.lightTextReadable}
          size={14}
          style={{
            marginRight: 5,
          }}
        />
        <Text style={localtyStyle.text} numberOfLines={2} >
          {beachSpot.locality}, {beachSpot.city.name}
        </Text>
      </View>
      {rightComponent}
    </View>
  );
};
