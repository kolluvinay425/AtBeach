import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts} from '../Themes';
function Header({heading}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingText}>{heading}</Text>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  headingText: {
    color: '#0070CA',
    fontSize: 25,
    fontFamily: Fonts.type.bold,
  },
});
