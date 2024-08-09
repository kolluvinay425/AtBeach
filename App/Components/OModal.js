// @flow

import React from 'react';
import ApplicationComponent from '../Containers/ApplicationComponent';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Modal from 'react-native-modal';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';

import NavigationBar from './NavigationBar';
import stylesfactory from './Styles/OModalStyle';
import {Metrics} from '../Themes';
import icoMoonConfig from '../../assets/fonts/selection.json';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const IPHONEX = isIphoneX() ? 5 : 0;

export default class OModal extends ApplicationComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    closeHandler: PropTypes.func,
    confirmHandler: PropTypes.func,
    cancelHandler: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmMessage: PropTypes.string,
    cancelMessage: PropTypes.string,
    iconName: PropTypes.string,
  };

  static defaultProps = {
    isVisible: false,
    closeHandler: () => {},
    confirmHandler: () => {},
    cancelHandler: () => {},
    title: '',
    message: '',
    confirmMessage: '',
    cancelMessage: '',
    iconName: 'check',
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  renderNavBar = () => (
    <NavigationBar
      colors={['transparent', 'transparent']}
      style={this.styles.navigationBarStyle}
      leftButton={{
        iconName: 'close',
        handler: this.props.closeHandler,
        iconSize: Metrics.icons.medium,
        iconColor: 'white',
      }}
    />
  );

  render() {
    const {
      isVisible,
      closeHandler,
      title,
      message,
      confirmHandler,
      cancelHandler,
      confirmMessage,
      cancelMessage,
      iconName,
    } = this.props;
    return this.state.reRender ? null : (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeHandler}
        onBackButtonPress={closeHandler}
        style={{margin: 10, marginTop: 10 + IPHONEX, justifyContent: 'center'}}
        backdropOpacity={0.9}>
        <View style={this.styles.container}>
          <View style={this.styles.content}>
            <Text style={this.styles.modalTitle}>{title}</Text>
            <Text style={this.styles.modalMessage}>{message}</Text>

            <TouchableOpacity
              style={this.styles.modalMainButton}
              onPress={confirmHandler}>
              <Text style={this.styles.actionConfirmText}>
                {confirmMessage}
              </Text>
            </TouchableOpacity>
            {cancelMessage && (
              <TouchableOpacity
                style={this.styles.modalCancelButton}
                onPress={cancelHandler}>
                <Text style={this.styles.actionCancelText}>
                  {cancelMessage}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={this.styles.imgContainer}>
            <View style={this.styles.imgContainerInner}>
              <Icon name={iconName} color="white" size={40} />
            </View>
          </View>
        </View>
        {this.renderNavBar()}
      </Modal>
    );
  }
}
