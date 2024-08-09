// @flow

import React, {useRef, forwardRef, useState, useCallback, useEffect} from 'react';
import {View, Text, StatusBar, Platform, Pressable, PanResponder} from 'react-native';
import Carousel from 'pinar';
import YoutubePlayer from 'react-native-youtube-iframe';
import FastImage from 'react-native-fast-image';
import I18n from 'i18n-js';

import {Metrics, Colors} from '../../Themes';
import {getBeachSpotImageUrl} from '../../Lib/Utilities';
import {isIphoneX} from 'react-native-iphone-x-helper';

const TOP_IMAGE_HEIGHT = (Metrics.windowHeight / 6) * 2.3;

const isIPhoneX = isIphoneX();
const isIOS = Platform.OS === 'ios';

export const MediaCarousel = forwardRef(
  ({beachSpot, isNavbarVisible}, imageCarouselRef) => {
    const videoPlayerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    // const [pointerEvents, setPointerEvents] = useState('auto');

    const togglePlaying = useCallback(() => {
      setPlaying((prev) => !prev);
    }, []);

    return (
      <Carousel
        // onScroll={()=> {
        //   console.log('SCROLL')
        //   setPointerEvents('none')
        // }}
        // onIndexChanged={()=> {
        //   console.log('END')
        //   setPointerEvents('auto')
        // }}
        ref={imageCarouselRef}
        autoplay={true}
        width={Metrics.windowWidth}
        height={TOP_IMAGE_HEIGHT}
        dotsContainerStyle={{
          position: 'absolute',
          bottom: -17,
          left: 0,
          right: 0,
          display: 'flex',
          opacity:
            beachSpot.youtube_video_code && beachSpot.youtube_video_code !== ''
              ? 1
              : 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        controlsTextStyle={{
          fontSize: 60,
          color: isNavbarVisible ? Colors.text : 'transparent',
        }}>
        {getBeachSpotImageUrl(beachSpot, true).map((picture) => <FastImage
          style={{
            width: Metrics.windowWidth,
            height: TOP_IMAGE_HEIGHT,
          }}
          key={Math.random()}
          source={picture}
        />)}
        {beachSpot.youtube_video_code && beachSpot.youtube_video_code !== '' ? (
          <Pressable
            onPress={() => {
              togglePlaying()
            }}
          >
            <View style={{backgroundColor: 'black' }}
                  pointerEvents={'none'}
            >
              <StatusBar barStyle="light-content" />
              <YoutubePlayer
                allowWebViewZoom={true}
                play={playing}
                ref={videoPlayerRef}
                height={TOP_IMAGE_HEIGHT - 25}
                width={Metrics.windowWidth}
                videoId={beachSpot.youtube_video_code}
                onChangeState={event => {
                  if (event === 'ended') {
                    videoPlayerRef?.player?.current?.seekTo(0);
                    setPlaying(false)
                  }
                }}
                volume={50}
                playbackRate={1}
                initialPlayerParams={{
                  cc_lang_pref: I18n.locale,
                  showClosedCaptions: false,
                  controls: false
                }}
                webViewProps={{
                  // FIX BLACK PADDINGS
                  injectedJavaScript: `             
                var element = document.getElementsByClassName('container')[0];
                      const style = { position: 'unset' }
                      Object.assign(element.style, style);
                      true;`,
                }}
              />
            </View>
          </Pressable>
        ) : null}
      </Carousel>
    );
  },
);
