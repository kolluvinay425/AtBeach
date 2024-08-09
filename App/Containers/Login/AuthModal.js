import React, {useState, useRef, forwardRef} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import stylesfactory from '../Styles/AuthModalStyle';
import {DefaultForm} from './AuthForms/DefaultForm';
import {SigninForm} from './AuthForms/SigninForm';
import {SignupForm} from './AuthForms/SignupForm';

export const AuthModal = forwardRef(({}, modalRef) => {
  const [authState, setAuthState] = useState('');

  const styles = stylesfactory.getSheet();

  const getComponentForState = () => {
    switch (authState) {
      case 'signin':
        return <SigninForm setAuthState={setAuthState} ref={modalRef} />;
      case 'signup':
        return <SignupForm setAuthState={setAuthState} ref={modalRef} />;
      default:
        return <DefaultForm setAuthState={setAuthState} ref={modalRef} />;
    }
  };

  return (
    <>
      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="inside"
          adjustToContentHeight
          scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <View style={styles.container}>{getComponentForState()}</View>
        </Modalize>
      </Portal>
    </>
  );
});
