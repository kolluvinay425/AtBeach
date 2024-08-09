import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, Platform} from 'react-native';
import I18n from 'i18n-js';
import {useDispatch, useSelector} from 'react-redux';

import UserAuthActions from '../../../Redux/UserAuthRedux';
import buttonStylesFactory from '../../../Components/Styles/ButtonStyle';
import stylesfactory from '../../Styles/AuthModalStyle';
import {Colors, Fonts} from '../../../Themes';

export const PhoneContact = ({callback}) => {
  const [phone, setPhone] = useState('');

  const userData = useSelector(state => state.userAuth);
  const {details} = userData;

  const dispatch = useDispatch();

  // const [name, setName] = useState(details?.name);
  // const [email, setEmail] = useState(details?.email);
  //const [phone, setPhone] = useState(details?.telephone_number);

  const styles = stylesfactory.getSheet();
  const buttonStyles = buttonStylesFactory.getSheet();

  useEffect(() => {
    if (details.telephone_number) {
      callback()
    }
  }, [details.telephone_number]);

  return (
    <View
      style={{
        paddingVertical: 40,
        paddingHorizontal: 15,
        alignItems: 'center',
      }}>
      <Text style={styles.title}>{I18n.t('beachSpotBookingPhoneTitle')}</Text>
      <Text style={[styles.text, {marginVertical: 10, paddingHorizontal: 20}]}>
        {I18n.t('beachSpotBookingPhoneMessage')}
      </Text>
      <TextInput
        testID="phone"
        style={styles.textInput}
        autoCapitalize="none"
        onChangeText={text => setPhone(text)}
        underlineColorAndroid="transparent"
        selectionColor={Colors.activeButton}
        returnKeyType="done"
        value={phone}
        placeholder="Numero di telefono"
        placeholderTextColor={Colors.grey}
      />
      <Text
        style={[
          styles.text,
          {
            color: Colors.titleBlue,
            marginTop: 10,
            marginBottom: 20,
            paddingHorizontal: 20,
          },
        ]}>
        {I18n.t('beachSpotBookingPhoneInfo')}
      </Text>
      <TouchableOpacity
        style={[buttonStyles.buttonActiveBig]}
        disabled={!phone}
        onPress={() => {
          dispatch(
            UserAuthActions.updateAccountRequest(
              {
                id: details.id,
                // name,
                // password,
                // email,
                telephone_number: phone,
              }
            ),
          );
        }}>
        <Text style={[buttonStyles.titleActive, {fontFamily: Fonts.type.bold}]}>
          {I18n.t('beachSpotBookingPhoneAction')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
