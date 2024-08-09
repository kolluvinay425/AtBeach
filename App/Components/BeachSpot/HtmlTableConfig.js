import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';
import {Fonts} from '../../Themes';
import {
  alterNode,
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  IGNORED_TAGS,
  makeTableRenderer,
} from 'react-native-render-html-table-bridge';

function getFontAssetURL(fontFileName) {
  return Platform.select({
    ios: `url(${fontFileName})`,
    android: `url(file://android_asset/fonts/${fontFileName})`,
  });
}

const MontserratRegularUnicodeRanges =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const MontserratRegular = getFontAssetURL(Fonts.type.base);
const cssRules =
  cssRulesFromSpecs({
    ...defaultTableStylesSpecs,
    fontFamily: '"Montserrat-Regular"', // beware to quote font family name!
  }) +
  `
@font-face {
  font-family: 'Montserrat-Regular';
  font-style: normal;
  font-weight: 400;
  src: ${MontserratRegular}, format('ttf');
  unicode-range: ${MontserratRegularUnicodeRanges};
}
`;

const config = {
  WebViewComponent: WebView,
  ...cssRules,
  tableStyleSpecs: {
    cellSpacingEm: 0.1,
    fitContainerWidth: true,
    fontSizePx: 15,
    thOddBackground: 'white',
    trOddBackground: 'white',
    borderWidthPx: 0,
  },
};

const renderers = {
  table: makeTableRenderer(config),
};

export const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS,
};

// EXAMPLE HTML TABLE WITH DRONE URL AND IMAGE
// <a href="https://drive.google.com/drive/folders/1DiQbVRtWtwA1RlptbPzePb9UVgOU8CBT?usp=sharing">
//   <table style="height: 45px;" width="100%">
//     <tbody>
//     <tr style="height: 45px;">
//       <td style="width: 1%; height: 45px;"><img src="https://res.cloudinary.com/innopa/image/upload/v1597084440/Drone-07-2_wd8yxj.png" width="45" height="45" /></td>
//       <td style="width: 99%; text-align: left; height: 45px;"><a href="https://drive.google.com/drive/folders/1DiQbVRtWtwA1RlptbPzePb9UVgOU8CBT?usp=sharing">Guarda la spiaggia ora dal drone</a></td>
//     </tr>
//     </tbody>
//   </table>
// </a>
