// Utility functions
import R from 'ramda';
import {Image, Linking, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors, Images} from '../Themes';
import I18n from 'i18n-js';
import Share from 'react-native-share';

import LaunchNavigator from 'react-native-launch-navigator';


export const checkTrue = string => {
  const normalizedString =
    typeof string === 'string' ? string.toLowerCase() : '';
  return String(normalizedString) == 'true';
};

export const capitalizeFirstLetter = string => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return '';
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validatePassword = data => data.length >= 8 && data.length <= 20;

export const getRandomBgColor = () => Math.round(Math.random() * 2);

// DOES NOT WORK AS EXPECTED
export function preloadImages(images) {
  const uris = images.map(image => ({
    uri: image ? Image.resolveAssetSource(image).uri : '',
  }));

  FastImage.preload(uris);
}

export const sortFirstArrayBySecondArray = (first, second) => {
  let sortInsert = function(acc, cur) {
    let toIdx = R.indexOf(cur.id, second);
    acc[toIdx] = cur;
    return acc;
  };
  let sort = R.reduce(sortInsert, []);
  return sort(first);
};

export const getBeachSpotImageUrl = (beachSpot, all= false) => {
  if (Array.isArray(beachSpot.picture)) {
    if (beachSpot.picture && beachSpot.picture.length > 0) {
      if (all) {
        const picturesUrls = []
        for (let i = 0; i < beachSpot.picture.length; i++) {
          picturesUrls.push(extractPicture(beachSpot.picture[i]))
        }
        return picturesUrls
      } else {
        return extractPicture(beachSpot.picture[0])
      }
    } else {
      return Images.beach.placeholder;
    }
  } else {
    // THIS IS A LEGACY CODE TO ALLOW COMPATIBILITY WITH PREVIOUS BACKEND WITHOUT ARRAY
    if (beachSpot.picture && beachSpot.picture.url) {
      return all ? [extractPicture(beachSpot.picture)] : extractPicture(beachSpot.picture)
    } else {
      return all ? [Images.beach.placeholder] : Images.beach.placeholder
    }
  }
};

const extractPicture = (picture) => {
  if (picture.url.indexOf('cloudinary.com/innopa') > -1) {
    const position_string = 'cloudinary.com/innopa/image/upload/';
    const position =
      picture.url.indexOf(position_string) + position_string.length;
    const new_url =
      picture.url.slice(0, position) + 'c_fill,f_auto,g_center,q_auto,w_1100/' + picture.url.slice(position);
    return {uri: new_url};
  } else {
    return {uri: picture.url};
  }
}

export const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function computeStateColor(last_spot_state) {

  if (!last_spot_state?.user_id && !last_spot_state?.reports) {
    return Colors.pinPublic;
  }

  switch (last_spot_state.beach_state_id) {
    case 0:
      return Colors.pinYellow;
    case 1:
      return Colors.pinGreen;
    case 2:
      return Colors.pinYellow;
    case 3:
      return Colors.pinRed;
    case 4:
      return Colors.pinBlack;
    default:
      return Colors.pinYellow;
  }
}

export function computePinColor(
  isPrivate,
  last_spot_state,
  pinColor,
  isActive,
) {
  if (pinColor) {
    return pinColor;
  }

  if (isPrivate) {
    return Colors.pinPrivate;
  } else {
    if (isActive) {
      // return Colors.pinPublicActive
    }
    return computeStateColor(last_spot_state);
    // return Colors.pinPublic
  }

  // DISABLED 2021
}

export const averageArray = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

export const averageWeatherSg = (sgObject, withDecimals = false) => {
  const values = Object.values(sgObject);
  const average = averageArray(values);

  if (withDecimals) {
    return Math.round(average * 10) / 10;
  } else {
    return Math.round(average);
  }
};

export const weatherGetImage = weather_info => {
  if (weather_info.precipitation || weather_info.cloudCover) {
    if (weather_info.precipitation.sg < 20 && weather_info.cloudCover.sg < 35) {
      return Images.weather.sun;
    }

    if (weather_info.precipitation.sg >= 75) {
      return Images.weather.rainFull;
    }

    if (weather_info.precipitation.sg >= 20) {
      return Images.weather.rainMid;
    }

    if (weather_info.cloudCover.sg >= 75) {
      return Images.weather.cloudFull;
    }

    if (weather_info.cloudCover.sg >= 35) {
      return Images.weather.cloudMid;
    }
  }

  return Images.weather.sun;
};

export const weatherSeaGetImage = weather_info => {
  if (weather_info.waveHeight) {
    if (weather_info.waveHeight.sg > 0.5) {
      return Images.weather.seaFull;
    }

    if (weather_info.waveHeight.sg > 0.14) {
      return Images.weather.seaMid;
    }

    if (weather_info.waveHeight.sg < 0.15) {
      return Images.weather.sea;
    }
  }

  return Images.weather.sea;
};

export const weatherCompassTextConvert = radius => {
  if (radius > 348.75 || radius <= 11.25) {
    return I18n.t('compass_N');
  } else if (radius > 11.25 && radius <= 33.75) {
    return I18n.t('compass_NNE');
  } else if (radius > 33.75 && radius <= 56.25) {
    return I18n.t('compass_NE');
  } else if (radius > 56.25 && radius <= 78.75) {
    return I18n.t('compass_ENE');
  } else if (radius > 78.75 && radius <= 101.25) {
    return I18n.t('compass_E');
  } else if (radius > 101.25 && radius <= 123.75) {
    return I18n.t('compass_ESE');
  } else if (radius > 123.75 && radius <= 146.25) {
    return I18n.t('compass_SE');
  } else if (radius > 146.25 && radius <= 168.75) {
    return I18n.t('compass_SSE');
  } else if (radius > 168.75 && radius <= 191.25) {
    return I18n.t('compass_S');
  } else if (radius > 191.25 && radius <= 213.75) {
    return I18n.t('compass_SSO');
  } else if (radius > 213.75 && radius <= 236.25) {
    return I18n.t('compass_SO');
  } else if (radius > 236.25 && radius <= 258.75) {
    return I18n.t('compass_OSO');
  } else if (radius > 258.75 && radius <= 281.25) {
    return I18n.t('compass_O');
  } else if (radius > 281.25 && radius <= 303.75) {
    return I18n.t('compass_ONO');
  } else if (radius > 303.75 && radius <= 326.25) {
    return I18n.t('compass_NO');
  } else if (radius > 326.25 && radius <= 348.75) {
    return I18n.t('compass_NNO');
  }
};

export const share = (latitude, longitude, name) => {
  const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${latitude},${longitude}`;
  Share.open({
    title: I18n.t('shareTitle'),
    subject: I18n.t('shareSubject'),
    message: I18n.t('shareMessage', {name: name, url: url}),
  }).catch(err => console.log(err));
};

export const navigateTo = (latitude, longitude, label = '') => {

  LaunchNavigator.navigate([latitude, longitude])
    .then(() => console.log("Launched navigator"))
    .catch((err) => console.error("Error launching navigator: "+err));

  // const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  // const latLng = `${latitude},${longitude}`;
  // let url = Platform.select({
  //   ios: `${scheme}${label}@${latLng}`,
  //   android: `${scheme}${latLng}(${label})`
  // });
  //
  // Linking.canOpenURL(url)
  //   .then(supported => {
  //     if (!supported) {
  //       url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${latitude},${longitude}`;
  //       return Linking.openURL(url);
  //     } else {
  //       return Linking.openURL(url);
  //     }
  //   })
  //   .catch(err => console.error('An error occurred', err));

};

export function openUrl(url: string): Promise<any> {
  return new Promise((resolve, reject)=> {
    Linking.openURL(url).then((r) => {
      resolve(r)
    }).catch((e) => {
      reject(e)
    });
  })
}
export function openSmsUrl(phone: string, body: string): Promise<any> {
  return openUrl(`sms:${phone}${getSMSDivider()}body=${body}`)
}
export function openWhatsappUrl(phone: string, body: string): Promise<any> {
  return openUrl(`whatsapp://send?phone=${phone}&text=${body}`);
}

export function openCallUrl(phone: string, body: string): Promise<any> {
  return openUrl(`tel:${phone}`)
}

export function getSMSDivider(): string {
  return Platform.OS === "ios" ? "&" : "?";
}
