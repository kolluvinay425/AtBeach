// @flow

import React, {useEffect, useState} from 'react';
import {View, Linking, Alert} from 'react-native';
import HTML from 'react-native-render-html';
import urlParser from 'url';

import {htmlConfig} from './HtmlTableConfig';
import {Metrics, Colors, Fonts} from '../../Themes';
import WebViewModal from '../../Containers/MapTab/WebViewModal';

const tagsStyles = {
  iframe: {
    opacity: 0.99, // WORKAROUND ANDROID CRASH
  },
  table: {
    opacity: 0.99, // WORKAROUND ANDROID CRASH
  },
};

export const HtmlViewer = ({content}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 900);
  }, []);

  if (!isVisible) {
    return null;
  }

  const onLinkPress = (event, url) => {
    const url_parsed = urlParser.parse(url, true, true);

    if (url_parsed.query.webview) {
      setWebViewUrl(url);
    } else {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            setTimeout(() => {
              Alert.alert('Operazione non supportata');
            }, 500);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  return (
    <View>
      <HTML
        tagsStyles={tagsStyles} // WORKAROUND ANDROID CRASH
        source={{html: content}}
        imagesMaxWidth={Metrics.windowWidth}
        style={{
          width: Metrics.windowWidth,
          height: Metrics.windowHeight,
        }}
        baseFontStyle={{
          color: Colors.sukaGrey,
          fontSize: Fonts.size.small,
          fontFamily: Fonts.type.base,
          lineHeight: 22
        }}
        {...htmlConfig}
        onLinkPress={onLinkPress}
      />
      <WebViewModal
        url={webViewUrl}
        title={''}
        isVisible={!!webViewUrl}
        closeHandler={() => setWebViewUrl('')}
      />
    </View>
  );
};
