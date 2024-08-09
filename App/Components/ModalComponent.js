import React, { ReactChild, useRef, useEffect } from 'react';
import { Modalize } from 'react-native-modalize';
import {View} from 'react-native';

type Props = {
  onClose: () => void;
  isVisible: boolean;
  children: ReactChild | ReactChild[];
};

const ModalComponent = (props) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef && modalRef.current) {
      if (props.isVisible) {
        modalRef.current.open();
      } else {
        modalRef.current.close();
      }
    }
  }, [props.isVisible]);

  props.setRef(modalRef)

  return (
    <Modalize
      {...props}
      ref={modalRef}
      onClose={props.onClose}
    >
      <View>{props.children}</View>
    </Modalize>
  );
};

export { ModalComponent };
