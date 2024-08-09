import React, {useRef} from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import {AuthModal} from './AuthModal';
import stylesfactory from '../Styles/AuthModalStyle';

export const LoginScreen = () => {
  const modalizeRef = useRef(null);

  const styles = stylesfactory.getSheet();

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => modalizeRef.current?.open()}>
        <Text style={styles.buttonText}>Test login</Text>
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <AuthModal />
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};
