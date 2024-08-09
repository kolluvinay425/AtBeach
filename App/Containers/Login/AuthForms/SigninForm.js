import React, {useState, forwardRef} from 'react';
import {Text, TouchableOpacity, View, TextInput} from 'react-native';
import I18n from 'i18n-js';
import IconIonicon from 'react-native-vector-icons/dist/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';

import UserAuthActions from '../../../Redux/UserAuthRedux';
import stylesfactory from '../../Styles/AuthModalStyle';
import {Colors} from '../../../Themes/Colors';

export const SigninForm = forwardRef(({setAuthState}, forwardedRef) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const styles = stylesfactory.getSheet();

  const userData = useSelector(state => state.userAuth);

  const isDisabled = !email || !password;

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
        <Text style={styles.title}>{I18n.t('authFormSignin')}</Text>
        <View />
      </TouchableOpacity>

      <Text style={styles.text}>{I18n.t('authFormMessage')}</Text>
      <View style={styles.separator}>
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
      </View>

      <View style={styles.separator}>
        <Text style={styles.smallText}>
          {`${I18n.t('authFormForgotten')} `}
          <Text style={[styles.smallText, {fontWeight: '700'}]}>
            {I18n.t('authFormRecover')}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(
            UserAuthActions.loginRequestEmail(
              {
                password,
                username: email,
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
          {I18n.t('authFormSignin').toUpperCase()}
        </Text>
      </TouchableOpacity>
      <View style={styles.separator}>
        <TouchableOpacity
          onPress={() => {
            setAuthState('signup');
          }}>
          <Text style={styles.text}>
            {'Non hai un account? '}
            <Text
              style={[
                styles.text,
                {color: Colors.activeButton, fontWeight: '700'},
              ]}>
              {I18n.t('authFormSignup')}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Spinner
        cancelable={false}
        visible={userData?.login?.isFetching}
        textContent=""
        textStyle={{color: 'white'}}
      />
    </View>
  );
});
