import React, {useState, forwardRef} from 'react';
import {Text, TouchableOpacity, View, TextInput} from 'react-native';
import I18n from 'i18n-js';
import {useDispatch, useSelector} from 'react-redux';

import {Colors} from '../../../Themes/Colors';
import stylesfactory from '../../Styles/AuthModalStyle';
import UserAuthActions from '../../../Redux/UserAuthRedux';

export const ProfileForm = forwardRef(({}, forwardedRef) => {
  const userData = useSelector(state => state.userAuth);
  const {details} = userData;

  const [name, setName] = useState(details?.name);
  const [email, setEmail] = useState(details?.email);
  const [password, setPassword] = useState(details?.password);
  const [phone, setPhone] = useState(details?.telephone_number);

  const dispatch = useDispatch();

  const styles = stylesfactory.getSheet();

  const isDisabled = !name || !email;

  return (
    <View style={{alignItems: 'center', paddingVertical: 40}}>
      <Text style={styles.title}>{I18n.t('profile_management')}</Text>
      <View style={styles.separator}>
        <TextInput
          testID="nome"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={text => setName(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={name}
          placeholder="Nome"
          placeholderTextColor={Colors.grey}
        />
        <TextInput
          testID="email"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={email}
          placeholder={I18n.t('emailPH')}
          placeholderTextColor={Colors.grey}
        />
        <TextInput
          testID="password"
          secureTextEntry={true}
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={text => setPassword(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={password}
          placeholder="Password"
          placeholderTextColor={Colors.grey}
        />
        <TextInput
          testID="phone"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={text => setPhone(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={phone}
          placeholder={I18n.t('phonePH')}
          placeholderTextColor={Colors.grey}
          placeholderStyle={styles.textInputPlaceholder}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: isDisabled ? Colors.grey : Colors.activeButton},
        ]}
        disabled={isDisabled}
        onPress={() => {
          // update profile action
          dispatch(
            UserAuthActions.updateAccountRequest({
              id: details.id,
              name,
              password,
              email,
              telephone_number: phone,
            }),
          );
          forwardedRef?.close();
        }}>
        <Text style={styles.buttonText}>{I18n.t('updateAction')}</Text>
      </TouchableOpacity>
    </View>
  );
});
