import React, {useState, forwardRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import I18n from 'i18n-js';
import {useDispatch, useSelector} from 'react-redux';
import {Fonts, Colors, Images, Metrics} from '../../../Themes';
import stylesfactory from '../../Styles/AuthModalStyle';
import {StyleSheet} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import metrics from '../../../Themes/Metrics';
import Header from '../../../Components/Header';
import images from '../../../Themes/Images';
export const ReportModal = forwardRef(({}, forwardedRef) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Spiaggia'},
    {key: 'second', title: 'Parcheggio'},
  ]);
  const userData = useSelector(state => state.userAuth);

  const dispatch = useDispatch();

  const styles = stylesfactory.getSheet();
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const _renderTabBar = props => {
    return (
      <SafeAreaView style={[styless.container]}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                styless.TabButton,
                {
                  backgroundColor:
                    index == i
                      ? styless.bg1.backgroundColor
                      : styless.bg2.backgroundColor,
                  shadowColor: '#000000',
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  shadowOffset: {
                    height: 0,
                    width: 0,
                  },
                  elevation: 3,
                },
              ]}
              onPress={() => setIndex(i)}>
              <Text
                style={[
                  styless.buttonText,
                  {
                    color:
                      index == i ? styless.color1.color : styless.color2.color,
                  },
                ]}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    );
  };
  const FirstRoute = () => (
    <View style={{alignItems: 'center'}}>
      {/* <Text style={styles.title}>Affolametro</Text> */}
      <Text
        style={[
          Fonts.style.description,
          {
            textAlign: 'center',
            color: 'rgba(29, 25, 25, 0.5)',
            marginHorizontal: 30,
          },
        ]}>
        Come hai trovato la spiaggia in relazione alle persone che c’erano?
      </Text>

      <View style={[styless.container]}>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.tree}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styless.title}>Vuota</Text>
        </View>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.boys}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styless.title}>Affolata</Text>
        </View>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.light}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View>
            <Text style={styless.title}>Piena</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styless.button, {backgroundColor: 'rgba(48, 140, 137, 1)'}]}>
        <Text
          style={{
            fontSize: Fonts.size.medium,
            fontFamily: Fonts.type.base,
            color: 'white',
            // marginLeft: 10,
            fontWeight: '800',
          }}>
          Invia il tuo feedback
        </Text>
      </TouchableOpacity>
    </View>
  );

  const SecondRoute = () => (
    <View style={{alignItems: 'center'}}>
      {/* <Text style={styles.title}>Affolametro</Text> */}
      <Text
        style={[
          Fonts.style.description,
          {
            textAlign: 'center',
            color: 'rgba(29, 25, 25, 0.5)',
            marginHorizontal: 30,
          },
        ]}>
        Come hai trovato la spiaggia in relazione alle persone che c’erano?
      </Text>

      <View style={[styless.container]}>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.tree}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styless.title}>Vuota</Text>
        </View>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.boys}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styless.title}>Affolata</Text>
        </View>
        <View>
          <TouchableOpacity style={styless.ImageContainer}>
            <Image
              style={styless.image}
              source={Images.report.light}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View>
            <Text style={styless.title}>Piena</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styless.button, {backgroundColor: 'rgba(48, 140, 137, 1)'}]}>
        <Text
          style={{
            fontSize: Fonts.size.medium,
            fontFamily: Fonts.type.base,
            color: 'white',
            // marginLeft: 10,
            fontWeight: '800',
          }}>
          Invia il tuo feedback
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView
        style={{
          height: 470,
          paddingVertical: 15,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Header heading={'Affolametro'} />
        </View>

        <TabView
          navigationState={{index, routes}}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute,
          })}
          renderTabBar={_renderTabBar}
          onIndexChange={setIndex}
        />
      </SafeAreaView>
    </>
  );
});
const styless = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    // paddingBottom: 50,
    // paddingHorizontal: 24,
  },
  button: {
    height: 60,
    backgroundColor: Colors.activeButton,
    width: 250,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: Metrics.doubleBaseMargin,
  },
  buttonText: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.base,
    color: 'white',
    marginLeft: 10,
    fontWeight: '800',
  },
  title: {
    ...Fonts.style.normal,
    color: 'rgba(29, 25, 25, 1)',
    textAlign: 'center',
    marginTop: 5,
  },
  bg1: {
    backgroundColor: 'rgba(0, 112, 202, 1)',
  },
  bg2: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  ImageContainer: {
    height: 80,
    width: 80,
    borderRadius: 50,
    backgroundColor: 'rgba(211, 211, 211, 1)',
    marginRight: 20,
    marginLeft: 20,
  },
  image: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    justifyContent: 'center',
    alignSelf: 'center',
    // marginTop: 12,
  },

  color1: {
    color: 'rgba(251, 251, 251, 1)',
  },
  color2: {
    color: 'rgba(109, 113, 136, 1)',
  },
  TabBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 5,
  },
  TabButton: {
    height: 45,
    width: metrics.windowHeight > 750 ? 120 : 100,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  color1: {
    color: 'rgba(251, 251, 251, 1)',
  },
  color2: {
    color: '#0070CA',
  },
  bg1: {
    backgroundColor: 'rgba(0, 112, 202, 1)',
  },
  bg2: {
    backgroundColor: 'white',
  },
});
