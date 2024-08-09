import React, {useState} from 'react';
import {Colors, Metrics, Fonts} from '../../Themes';
import {View, TouchableOpacity, Text} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';

function BottomButton({isPrivate}) {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      {!isPrivate && (
        <TouchableOpacity
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 3,
            elevation: 4,
            backgroundColor: 'white',
            width: 60,
            height: 60,
            borderRadius: 99999,
            marginRight: 22,
            justifyContent: 'center',
          }}>
          <IconFeather
            name={'navigation'}
            color={'blue'}
            size={25}
            style={{
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{
          height: 60,
          backgroundColor: isPrivate ? '#FF3B5F' : 'rgba(48, 140, 137, 1)',
          width: 280,
          borderRadius: 26,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: Fonts.size.medium,
            fontFamily: Fonts.type.base,
            color: 'white',
            marginLeft: 10,
            fontWeight: '800',
          }}>
          {isPrivate ? 'Seleziona la data' : 'Stato della spiaggia'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default BottomButton;
