import React, {useRef} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, Image} from 'react-native';
import I18n from 'i18n-js';

import stylesfactory from '../Styles/ProfilScreenStyle';
import {AuthModal} from './AuthModal';
import {Fonts, Colors, Images, Metrics} from '../../Themes';

export const AuthModalContainer = ({}) => {
  const styles = stylesfactory.getSheet();

  const authModalRef = useRef(null);

  return (
    <SafeAreaView style={styles.mainTabContainer}>
      <View style={styles.content}>
        <Text
          style={[
            Fonts.style.normal,
            {marginTop: 80, margin: 40, textAlign: 'center'},
          ]}>
          {I18n.t('authFormMessage')}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => authModalRef?.current?.open()}>
          <Text style={styles.buttonText}>{I18n.t('authFormSignin')}</Text>
        </TouchableOpacity>
        <AuthModal ref={authModalRef} />
      </View>
      <Image
        source={Images.onboarding.second}
        style={{
          width: Metrics.windowWidth,
          height: Metrics.windowHeight - 300,
        }}
        resizeMode={'contain'}
      />
    </SafeAreaView>
  );
};
