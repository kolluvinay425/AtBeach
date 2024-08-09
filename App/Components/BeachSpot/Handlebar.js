// @flow

import React from 'react';
import {View} from 'react-native';

import {Colors} from '../../Themes';

export const Handlebar = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      marginBottom: 20,
    }}>
    <View
      style={{
        height: 5,
        width: 55,
        backgroundColor: Colors.lightgreyBorder,
        borderRadius: 10,
      }}
    />
  </View>
);
