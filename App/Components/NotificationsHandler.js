// import React from 'react';
// import ApplicationComponent from '../Containers/ApplicationComponent';
// import {LayoutAnimation, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import {connect} from 'react-redux';
// import I18n from "i18n-js";
// import PropTypes from 'prop-types';
//
// import stylesfactory from './Styles/NetworkStatusBarStyle';
// import NetInfo from "@react-native-community/netinfo";
// import StartupActions from "../Redux/StartupRedux";
// import NotificationsActions from "../Redux/NotificationsRedux";
// import LoginActions from "../Redux/LoginRedux";
// import DeepLinkManager from "../Lib/LinkingUtils";
// import {checkNotifications,
//   openSettings,
//   PERMISSIONS,
//   requestNotifications
// } from "react-native-permissions";
//
// import moment from "moment";
// import OModal from "./OModal";
// import {NavigationActions, StackActions} from "react-navigation";
// import notifications from '@react-native-firebase/messaging';
// import messaging from '@react-native-firebase/messaging';
// import * as NavigationService from "../Lib/NavigationService";
// import ProfileStackNavigator from "../Navigation/Community/ProfileStackNavigator";
//
// const isIOS = Platform.OS === "ios";
// class NotificationsHandler extends ApplicationComponent {
//   static propTypes = {
//     notificationSubscribeRequest: PropTypes.func,
//     userAccessCount: PropTypes.number
//   };
//
//   static defaultProps = {
//     notificationSubscribeRequest: () => {},
//     userAccessCount: 0
//   };
//
//   constructor(props) {
//     super(props);
//
//     // this.styles = stylesfactory.getSheet()
//     this.state = {
//       ...this.state,
//     };
//   }
//
//   UNSAFE_componentWillReceiveProps(newProps) {
//     console.log(this.props)
//     console.log(newProps)
//     if (!newProps.isNotificationRegistered && newProps.isLogged && newProps.isReady) {
//       this.manageNotificationPermissions();
//     }
//   }
//
//   componentDidMount(){
//     this.handleNotifications()
//   }
//
//   handleNotifications = () => {
//
//     // APP OPENED ON FOREGROUND, MESSAGE RECEIVED - TODO
//     messaging().onMessage(async remoteMessage => {
//       console.log('ON MESSAGE', remoteMessage);
//     });
//
//     // APP OPENED BUT ON BACKGROUND, MESSAGE RECEIVED BUT NOT CLICKED - IGNORE!!
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Message handled in the background! - BACKGROUNDHANDLER', remoteMessage);
//     });
//
//     // MESSAGE CLICKED, APP WAS OPENED BUT ON BACKGROUND
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       if (remoteMessage) {
//         console.log('ON NOTIFICATION OPENED APP', remoteMessage);
//         this.handleNotification(remoteMessage, false)
//       }
//     });
//
//     // MESSAGE CLICKED, APP WAS CLOSED
//     messaging().getInitialNotification().then(remoteMessage => {
//       if (remoteMessage) {
//         console.log('GET INITIAL NOTIFICATION', remoteMessage);
//         this.handleNotification(remoteMessage, true);
//       }
//     });
//
//
//   };
//
//   handleNotification = (notification, isStartup) => {
//     if (notification && notification.data && notification.data.activity) {
//
//       if(isIOS){
//         PushNotificationIOS.getApplicationIconBadgeNumber((count) => {
//           let newCount = count - 1
//           if(newCount < 0){
//             newCount = 0
//           }
//           PushNotificationIOS.setApplicationIconBadgeNumber(newCount)
//         })
//
//       }
//       // if (notif._data.activity && (isStartup || notif.opened_from_tray)) {
//
//       let customData = JSON.parse(notification.data.activity);
//
//       this.handleNotificationClick(customData);
//
//       // messaging().getBadge().then(number => {
//       //   messaging().setBadge(number + 1)
//       // })
//     }
//   };
//
//   handleNotificationClick = activity => {
//     // notifications().setBadge(0)
//
//     // console.log(activity)
//     switch (activity.key) {
//       case "recipes_recipe.create":
//       case "recipes_recipe.forked":
//       case "recipes_recipe.derivatemod": {
//
//         NavigationService.navigate('Profile');
//         const resetAction = StackActions.reset({
//           index: 2,
//           actions: [
//             NavigationActions.navigate({routeName: "Profile"}),
//             NavigationActions.navigate({routeName: "Notifications"}),
//             NavigationActions.navigate({
//               routeName: "Recipe",
//               params: {
//                 id: parseInt(activity.trackable.id, 10),
//                 data: undefined
//               },
//               key: `Recipe-${parseInt(activity.trackable.id, 10)}`
//             })
//           ]
//         });
//
//         NavigationService.dispatch(resetAction);
//
//         // setTimeout(() => {
//         //   this.props.getNotifications(1);
//         //   notifications().setBadge(0)
//         // }, 2000);
//
//         break;
//       }
//       case "commontator_comment.create":
//       case "commontator_comment.reply": {
//
//         NavigationService.navigate('Profile');
//         const resetAction = StackActions.reset({
//           index: 3,
//           key: null,
//           actions: [
//             NavigationActions.navigate({
//               routeName: "Profile",
//             }),
//             NavigationActions.navigate({
//               routeName: "Notifications",
//             }),
//             NavigationActions.navigate({
//               routeName: "Recipe",
//               params: {
//                 id: parseInt(activity.trackable.id, 10),
//               },
//               key: `Recipe-${parseInt(activity.trackable.id, 10)}`
//             }),
//             NavigationActions.navigate({
//               routeName: "Comments",
//               params: {
//                 id: parseInt(activity.trackable.id, 10)
//               },
//               key: `Comments-${parseInt(activity.trackable.id, 10)}`
//             })
//           ]
//         });
//         NavigationService.dispatch(resetAction);
//
//         // NavigationService.dispatch(resetAction);
//
//         // setTimeout(() => {
//         //   this.props.getNotifications(1);
//         //   notifications().setBadge(0)
//         // }, 2000);
//         break;
//       }
//       case "users_followering.create": {
//
//         NavigationService.navigate('Profile');
//         const resetAction = StackActions.reset({
//           index: 1,
//           actions: [
//             NavigationActions.navigate({routeName: "Profile"}),
//             NavigationActions.navigate({routeName: "Notifications"}),
//             NavigationActions.navigate({
//               routeName: "User",
//               params: {
//                 id: parseInt(activity.owner.id, 10),
//                 name: activity.owner.fullname
//               },
//               key: `User-${parseInt(activity.owner.id, 10)}`
//             })
//           ]
//         });
//         NavigationService.dispatch(resetAction);
//
//         // setTimeout(() => {
//         //   this.props.getNotifications(1);
//         //   notifications().setBadge(0)
//         // }, 2000);
//
//         break;
//       }
//       default:
//         break;
//     }
//   };
//
//   handleNotificationPermissionConfirm = () => {
//     if (this.state.permissionStatus === "denied") {
//       requestNotifications(['alert', 'badge', 'sound', 'criticalAlert']).then(({status, settings}) => {
//         if (status === 'granted') {
//           this.props.notificationSubscribeRequest();
//         }
//       })
//     } else {
//       openSettings();
//     }
//     this.setState({showPermissionModal: false});
//   }
//
//   handleNotificationPermissionCancel = () => {
//     this.setState({showPermissionModal: false})
//     this.props.setNotificationModalForcehide()
//   }
//
//   manageNotificationPermissions = () => {
//     if (isIOS) {
//       checkNotifications().then(response => {
//         this.setState({permissionStatus: response.status});
//         console.log('NOTIRIFATIONS RESPONSE 2', response.status)
//         // Response is one of: 'granted', 'denied', 'blocked', or 'undetermined'
//         if (response.status === "granted") {
//           this.props.notificationSubscribeRequest();
//         } else {
//           console.log(response.status == "denied")
//           console.log(this.props.userNotificationModal.forceHide != true)
//           console.log(this.props.userAccessCount > 1)
//           if (response.status == "denied" &&
//             (this.props.userNotificationModal.forceHide != true ||
//               moment().diff(moment(this.props.userNotificationModal.lastCancel), 'days') > 6) &&
//             this.props.userAccessCount > 1) {
//             this.setState({showPermissionModal: true});
//           }
//         }
//       });
//     } else {
//
//       messaging().requestPermission()
//         .then(() => {
//           this.props.notificationSubscribeRequest();
//         })
//         .catch(error => {
//         });
//
//     }
//   }
//
//   render() {
//     if (this.state.showPermissionModal) {
//       return (this.state.reRender ? null :
//           <View>
//             {this.state.showPermissionModal && (
//               <OModal
//                 isVisible={this.state.showPermissionModal}
//                 closeHandler={() => this.setState({showPermissionModal: false})}
//                 confirmHandler={this.handleNotificationPermissionConfirm}
//                 cancelHandler={this.handleNotificationPermissionCancel}
//                 title="Poche notifiche utili"
//                 message="Vuoi ricevere notifiche su ciò che ti piace e consigli nutrizionali?"
//                 confirmMessage={
//                   this.state.permissionStatus === "blocked"
//                     ? "Apri impostazioni"
//                     : "Ok"
//                 }
//                 cancelMessage="Non consentire"
//               />
//             )}
//           </View>
//       );
//     }
//     return null;
//   }
// }
//
// const mapStateToProps = state => ({
//   userNotificationModal: state.userAuth.notificationModal,
//   isLogged: state.userAuth.isLogged,
//   isReady: state.startup.isReady,
//   isNotificationRegistered: state.userAuth.isNotificationRegistered,
//   userAccessCount: state.userAuth.accessCount,
// });
//
// const mapDispatchToProps = dispatch => ({
//   notificationSubscribeRequest: () => dispatch(NotificationsActions.notificationSubscribeRequest()),
//   setNotificationModalForcehide: () => dispatch(LoginActions.setNotificationModalForcehide())
// });
//
//
// export default connect(mapStateToProps, mapDispatchToProps)(NotificationsHandler);
