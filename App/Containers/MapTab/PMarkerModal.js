import React, {useState} from 'react';
import {ModalComponent} from '../../Components/ModalComponent';
import {Text} from 'react-native';
function PMarkerModal(props) {
  // const [modalizeDraggable,setModalizeDraggable] = useState(true)
  // const setModalizeDraggable = (value = false) => {
  //   this.setState({modalizeDraggable: value});
  // };
  const modalRef = null;
  setModalizeDraggable = (value = false) => {
    this.setState({modalizeDraggable: value});
  };
  return (
    <ModalComponent
      setRef={ref => (modalRef = ref)}
      onclose={props.onClose}
      isVisible={props.isVisible}>
      <Text>i'm the Pmarker modal</Text>
    </ModalComponent>
  );
}

export default PMarkerModal;
