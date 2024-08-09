import React, {useState} from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import I18n from 'i18n-js';

import buttonStylesFactory from '../../../Components/Styles/ButtonStyle';
import stylesfactory from '../../Styles/AuthModalStyle';
import {Colors, Fonts} from '../../../Themes';

export const Notes = ({setAuthState}) => {
  const [note, setNote] = useState('');

  const styles = stylesfactory.getSheet();
  const buttonStyles = buttonStylesFactory.getSheet();

  return (
    <View
      style={{
        paddingVertical: 40,
        paddingHorizontal: 15,
        alignItems: 'center',
      }}>
      <Text style={styles.title}>{I18n.t('beachSpotBookingAddNotes')}</Text>
      <Text style={[styles.text, {marginVertical: 10, paddingHorizontal: 20}]}>
        {I18n.t('beachSpotBookingAddNotesMessage')}
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={[styles.textInput, {height: 150}]}
        autoCapitalize="none"
        onChangeText={text => setNote(text)}
        underlineColorAndroid="transparent"
        selectionColor={Colors.activeButton}
        returnKeyType="done"
        value={note}
        placeholder="Inserisci una nota"
        placeholderTextColor={Colors.grey}
      />
      <TouchableOpacity
        style={[buttonStyles.buttonActiveBig, {marginTop: 10}]}
        onPress={() => {}}>
        <Text style={[buttonStyles.titleActive, {fontFamily: Fonts.type.bold}]}>
          {I18n.t('beachSpotBookingAddNotesAction')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
