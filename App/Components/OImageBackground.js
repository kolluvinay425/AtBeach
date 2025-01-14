import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class OImageBackground extends Component {
  render() {
    const {children, style, imageRef, ...props} = this.props;

    return (
      <View style={style} ref={this._captureRef}>
        <FastImage
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              width: style.width,
              height: style.height,
            },
            style,
          ]}
        />
        {children}
      </View>
    );
  }
}
