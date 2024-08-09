import {Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes';
import I18n from 'i18n-js';
import moment from 'moment';
import {computeStateColor} from '../../Lib/Utilities';
import React from 'react';
import ApplicationComponent, {
  mapDispatchToPropsDefault,
  mapStateToPropsDefault,
} from '../ApplicationComponent';
import PropTypes from 'prop-types';
import stylesfactory from '../Styles/BeachSpotCard';
import buttonStylesFactory from '../../Components/Styles/ButtonStyle';
import BeachSpotActions from '../../Redux/BeachSpotRedux';
import {connect} from 'react-redux';
import renderWhenFocused from 'render-when-focused';

class BeachReportCard extends ApplicationComponent {
  static propTypes = {
    closeHandler: PropTypes.func,
  };

  static defaultProps = {
    isFetchingCode: false,
  };

  constructor(props) {
    super(props);

    this.styles = stylesfactory.getSheet();
    this.buttonStyles = buttonStylesFactory.getSheet();
    this.state = {
      ...this.state,
    };
  }

  render() {
    const {item, beachStates, style, data} = this.props;
    return (
      <View key={item.id} style={[this.styles.container, style]}>
        {beachStates && (
          <TouchableOpacity
            onPress={() => {
              this.props.showCardDetails(item);
            }}>
            <View>
              <Text numberOfLines={1} style={this.styles.name}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={this.styles.locality}>
                {item.city.name}, {item.locality}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'stretch',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}>
                {data.map(report => {
                  return (
                    <Text>
                      <Text
                        style={{
                          ...Fonts.style.description,
                          color: computeStateColor(report),
                        }}>
                        {beachStates[report.beach_state_id].name[I18n.locale]}
                      </Text>
                      :<Text style={{...Fonts.style.h6}}> {report.count}</Text>
                    </Text>
                  );
                })}
              </View>
              <View style={this.styles.statusContainer}>
                <View>
                  <Text
                    style={[
                      this.styles.statusTitle,
                      {
                        color:
                          item.last_spot_state.beach_state_id !==
                          data[0].beach_state_id
                            ? Colors.pinRed
                            : Colors.lightTextReadable,
                      },
                    ]}>
                    {I18n.t('beachSpot_reportCard_currentState')}
                  </Text>
                  <Text style={this.styles.statusName}>
                    {
                      beachStates[item.last_spot_state.beach_state_id].name[
                        I18n.locale
                      ]
                    }
                  </Text>
                  <Text style={this.styles.statusUpdatedAt}>
                    {moment(item.last_spot_state.created_at).fromNow()}
                  </Text>
                </View>
                <View
                  style={[
                    this.styles.statusBar,
                    {backgroundColor: computeStateColor(item.last_spot_state)},
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...mapStateToPropsDefault(state),
  beachStates: state.startup.initVariables.beach_states,
});

const mapDispatchToProps = dispatch => ({
  ...mapDispatchToPropsDefault(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(renderWhenFocused(BeachReportCard));
