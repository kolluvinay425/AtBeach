import React, {forwardRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import I18n from 'i18n-js';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import UserAuthActions from '../../../Redux/UserAuthRedux';
import stylesfactory from '../../Styles/AuthModalStyle';
import {Colors} from '../../../Themes/Colors';

const isIOS = Platform.OS === 'ios';

export const DefaultForm = forwardRef(({setAuthState}, modalRef) => {
  const styles = stylesfactory.getSheet();

  const userData = useSelector(state => state.userAuth);
  const {login} = userData;

  const dispatch = useDispatch();
  return (
    <View style={{paddingHorizontal: 15}}>
      <Spinner
        cancelable={false}
        visible={login.isFetching}
        textContent=""
        textStyle={{color: 'black'}}
      />
      <Text style={styles.title}>{I18n.t('authFormSignup')}</Text>
      <Text style={styles.text}>{I18n.t('authFormMessage')}</Text>
      <View style={styles.separator}>
        <TouchableOpacity
          disabled={login.isFetching}
          onPress={() =>
            dispatch(
              UserAuthActions.loginRequestFb(() => {
                modalRef.current?.close();
              }),
            )
          }
          style={[styles.button, {backgroundColor: '#1777F2'}]}>
          <FontAwesome
            name="facebook-square"
            size={20}
            style={{color: 'white'}}
          />
          <Text style={styles.buttonText}>{`${I18n.t(
            'authFormWith',
          )} Facebook`}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: 'white',
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              shadowOffset: {
                height: 3,
              },
              elevation: 4,
            },
          ]}>
          <FontAwesome name="google" size={20} style={{color: '#737373'}} />
          <Text style={[styles.buttonText, {color: '#737373'}]}>
            {`${I18n.t('authFormWith')} Google`}
          </Text>
        </TouchableOpacity> */}
        {isIOS && (
          <TouchableOpacity
            disabled={login.isFetching}
            style={[styles.button, {backgroundColor: 'black'}]}
            onPress={() =>
              dispatch(
                UserAuthActions.loginRequestApple(() => {
                  modalRef.current?.close();
                }),
              )
            }>
            <FontAwesome name="apple" size={20} style={{color: 'white'}} />
            <Text style={styles.buttonText}>
              {`${I18n.t('authFormWith')} Apple`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.separator}>
        <TouchableOpacity
          disabled={login.isFetching}
          style={styles.button}
          onPress={() => setAuthState('signup')}>
          <Text style={styles.buttonText}>{I18n.t('authFormEmail')}</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>
          {`${I18n.t('authFormEmail')} `}
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://drive.google.com/file/d/1JVDU6MXlz3AfdyWJzEpdq7XnF1wD2owz/view?usp=sharing',
              );
            }}>
            <Text
              style={[
                styles.smallText,
                {textDecorationLine: 'underline', fontWeight: '700'},
              ]}>
              {I18n.t('authFormTerms')}
            </Text>
          </TouchableOpacity>
        </Text>
      </View>

      <View style={styles.separator}>
        <TouchableOpacity onPress={() => setAuthState('signin')}>
          <Text style={styles.text}>
            {`${I18n.t('authFormAccount')} `}
            <Text
              style={[
                styles.text,
                {color: Colors.activeButton, fontWeight: '700'},
              ]}>
              {I18n.t('authFormSignin')}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
