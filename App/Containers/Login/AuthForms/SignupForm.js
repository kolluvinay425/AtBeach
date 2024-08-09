import React, {useState, forwardRef, useEffect} from 'react';
import {Text, TouchableOpacity, View, TextInput} from 'react-native';
import I18n from 'i18n-js';
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';

import {Colors} from '../../../Themes/Colors';
import stylesfactory from '../../Styles/AuthModalStyle';
import UserAuthActions from '../../../Redux/UserAuthRedux';

export const SignupForm = forwardRef(({setAuthState}, forwardedRef) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const styles = stylesfactory.getSheet();

  const userData = useSelector(state => state.userAuth);

  const isDisabled = !name || !email || !password;

  const dispatch = useDispatch();

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => setAuthState('')}>
        <IconIonicon
          size={30}
          name={'ios-arrow-back'}
          style={{color: 'black', textAlign: 'center', height: 30, width: 30}}
        />
        <Text style={styles.title}>{I18n.t('authFormWelcome')}</Text>
        <View />
      </TouchableOpacity>
      <Text style={styles.text}>{I18n.t('authFormMessage')}</Text>
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
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={text => setPassword(text)}
          underlineColorAndroid="transparent"
          selectionColor={Colors.activeButton}
          returnKeyType="done"
          value={password}
          placeholder={I18n.t('passwordPH')}
          placeholderTextColor={Colors.grey}
          placeholderStyle={styles.textInputPlaceholder}
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
        disabled={isDisabled}
        style={[
          styles.button,
          {backgroundColor: isDisabled ? Colors.grey : Colors.activeButton},
        ]}
        onPress={() => {
          dispatch(
            UserAuthActions.createAccountRequest(
              {
                name,
                password,
                email,
                telephone_number: phone,
              },
              () => {
                forwardedRef?.current?.close();
                showMessage({
                  message: I18n.t('email_confirm_message'),
                  description: I18n.t('email_confirm_description'),
                  type: 'warning',
                  duration: 3000,
                });
              },
            ),
          );
        }}>
        <Text style={styles.buttonText}>
          {I18n.t('authFormSignup').toUpperCase()}
        </Text>
      </TouchableOpacity>
      <Spinner
        cancelable={false}
        visible={userData?.login?.isFetching}
        textContent=""
        textStyle={{color: 'white'}}
      />
    </View>
  );
});
