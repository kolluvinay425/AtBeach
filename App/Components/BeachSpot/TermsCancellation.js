import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import {Fonts, Colors} from '../../Themes';
function TermsCancellation() {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontSize: Fonts.size.medium,
            fontFamily: Fonts.type.bold,
            color: Colors.text,
            marginBottom: 7,
            letterSpacing: 0.5,
          }}>
          Termini di cancellazione
        </Text>
        <TouchableOpacity>
          <IconFeather
            name={'arrow-right'}
            color={'rgba(255, 59, 95, 1)'}
            size={25}
            style={{
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TermsCancellation;
