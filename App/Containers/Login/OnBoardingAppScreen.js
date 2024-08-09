import React from 'react';
import ApplicationComponent from '../ApplicationComponent';
import {
  ImageBackground,
  InteractionManager,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  View,
} from 'react-native';
import I18n from 'i18n-js';
import AppIntroSlider from 'react-native-app-intro-slider';
import {onboardingstyles} from '../Styles/onBoardingStyles';
import stylesfactory from '../../Components/Styles/AppIntroStaticStyle';
import {Images, Metrics} from '../../Themes';
import {connect} from 'react-redux';
import {NavigationActions, StackActions} from 'react-navigation';
import {preloadImages} from '../../Lib/Utilities';
import OImageBackground from '../../Components/OImageBackground';

import UserAuthActons from '../../Redux/UserAuthRedux';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {color} from 'react-native-reanimated';
import images from '../../Themes/Images';
import {TouchableOpacity} from 'react-native';

const isIOS = Platform.OS === 'ios';

class OnBoardingAppScreen extends ApplicationComponent {
  // static propTypes = {
  //   onClose: PropTypes.func,
  // };
  //
  // static defaultProps = {
  //   onClose: () => {
  //   },
  // };

  constructor(props) {
    super(props);

    const images = [
      Images.onboarding.first,
      Images.onboarding.secondImg,
      Images.onboarding.third,
      Images.onboarding.skip,
    ];
    preloadImages(images);

    const pageArray = [
      {
        title: I18n.t('onboardFirstTitle'),
        description: I18n.t('onboardFirstDesc'),
        img: 'community',
        bg: images[0],
        imgSize: Metrics.icons.xl,
        fontColor: '#000',
        level: 10,
        weAreInPuglia: true,
        lines: 7,
      },
      {
        title: I18n.t('onboardSecondTitle'),
        description: I18n.t('onboardSecondDesc'),
        img: 'recipebook',
        bg: images[1],
        imgSize: Metrics.icons.xl,
        fontColor: '#000',
        level: 10,
        weAreInPuglia: true,
        lines: 5,
      },
      {
        title: I18n.t('onboardThirdTitle'),
        description: I18n.t('onboardThirdDesc'),
        img: 'recipebook',
        bg: images[2],
        imgSize: Metrics.icons.xl,
        fontColor: '#000',
        level: 10,
        weAreInPuglia: false,
        lines: 5,
      },
    ];

    this.styles = stylesfactory.getSheet();
    this.state = {
      pageArray: pageArray,
      ...this.state,
      step: 0,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // HACK FORCES LOAD SLIDE IMAGES ON ANDROID
      setTimeout(() => {
        this.forcePreload(3);
      }, 500);
      setTimeout(() => {
        this.forcePreload(2);
      }, 510);
      setTimeout(() => {
        this.forcePreload(1);
      }, 515);
      setTimeout(() => {
        this.forcePreload(0);
      }, 520);
      setTimeout(() => {
        this.forcePreload(0);
      }, 1000);
    });
  }

  forcePreload = slide => {
    if (this.slider) {
      this.slider.goToSlide(slide);
    }
  };

  onClose = () => {
    this.props.setOnBoardingViewed();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Map',
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };

  handlePress = () => {
    if (this.state.step < 3) {
      this.setState({
        step: this.state.step + 1,
      });
      if (isIOS) {
        LayoutAnimation.easeInEaseOut();
      }
    } else {
      this.onClose();
    }
  };

  // renderDoneButton = () => (
  //   <View style={[this.styles.full, {marginBottom: MARGIN_BOTTOM_BUTTON}]}>
  //     <Text style={this.styles.buttonText}>{I18n.t('done').toUpperCase()}</Text>
  //   </View>
  // );

  // renderNextButton = () => (
  //   <View style={[this.styles.full, {marginBottom: MARGIN_BOTTOM_BUTTON}]}>
  //     <Text style={this.styles.buttonText}>{I18n.t('next').toUpperCase()}</Text>
  //   </View>
  // );
  renderDoneButton = () => (
    <View style={[onboardingstyles.buttonContainer]}>
      <Text style={onboardingstyles.buttonText}>
        {I18n.t('done').toUpperCase()}
      </Text>
    </View>
  );
  renderNextButton = () => (
    <View style={[onboardingstyles.buttonContainer]}>
      <Text style={onboardingstyles.buttonText}>
        {I18n.t('next').toUpperCase()}
      </Text>
    </View>
  );
  renderPage = props => {
    const {
      title,
      description,
      img,
      imgSize,
      bg,
      fontColor,
      weAreInPuglia,
      lines,
    } = props.item;
    return (
      <View testID="appintro" style={this.styles.bg}>
        <View style={onboardingstyles.container}>
          <ImageBackground source={bg} style={onboardingstyles.image} />
          {weAreInPuglia && (
            <TouchableOpacity
              onPress={() => this.onClose()}
              style={onboardingstyles.skip}>
              <ImageBackground
                style={onboardingstyles.skipImage}
                source={images.onboarding.skip}
              />
            </TouchableOpacity>
          )}
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['rgba(0, 112, 202, 0)', 'rgba(0, 112, 202, 1)']}
            style={{
              width: Metrics.windowWidth,
              height: (Metrics.windowHeight / 5) * 2,
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
          />
          <View style={onboardingstyles.textWrapper}>
            <View style={onboardingstyles.viewTitle}>
              <Text style={onboardingstyles.title}>{title}</Text>
            </View>
            <View style={onboardingstyles.viewDescription}>
              <Text style={onboardingstyles.desc}>{description}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  //   return (
  //     <SafeAreaView testID="appintro" style={this.styles.bg}>
  //       <View
  //         style={[
  //           this.styles.info,
  //           {
  //             height: (Metrics.windowHeight / 5) * 2,
  //             paddingHorizontal: Metrics.doubleBaseMargin,
  //             paddingTop: Metrics.doubleBaseMargin * 2,
  //             paddingBottom: 0,
  //             overflow: 'visible',
  //           },
  //         ]}>
  //         <View>
  //           {weAreInPuglia && (
  //             <Image
  //               source={Images.weAreInPuglia}
  //               style={this.styles.backgroundImage}
  //             />
  //           )}
  //           <Text style={[this.styles.title, {color: fontColor}]}>{title}</Text>
  //         </View>
  //         <View style={{height: Metrics.windowHeight / 5}}>
  //           <Text
  //             style={[this.styles.description, {color: fontColor}]}
  //             adjustsFontSizeToFit
  //             minimumFontScale={0.6}>
  //             {description}
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={{height: (Metrics.windowHeight / 5) * 3}}>
  //         <LinearGradient
  //           start={{x: 0, y: 0}}
  //           end={{x: 0, y: 1}}
  //           colors={['#0571cb', '#0a85cb', '#149bd5']}
  //           style={{
  //             width: Metrics.windowWidth,
  //             height: (Metrics.windowHeight / 5) * 2,
  //             position: 'absolute',
  //             right: 0,
  //             bottom: 0,
  //           }}
  //         />
  //         <FastImage
  //           resizeMode={'contain'}
  //           source={bg}
  //           style={[
  //             {
  //               height: Metrics.windowHeight / 2,
  //               width: Metrics.windowWidth,
  //               position: 'absolute',
  //               right: 0,
  //               bottom: 20,
  //             },
  //           ]}
  //         />
  //       </View>
  //     </SafeAreaView>
  //   );
  // };

  render() {
    return this.state.reRender ? null : (
      <AppIntroSlider
        slides={this.state.pageArray}
        renderItem={this.renderPage}
        bottomButton={false}
        showSkipButton={false}
        // renderPagination={this._renderPagination}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        skipLabel={I18n.t('skip')}
        onSlideChange={() =>
          this.setState({
            step: this.state.step + 1,
          })
        }
        ref={ref => (this.slider = ref)}
        onDone={this.onClose}
        onSkip={this.onClose}
      />
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setOnBoardingViewed: () => dispatch(UserAuthActons.setOnBoardingViewed()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnBoardingAppScreen);
