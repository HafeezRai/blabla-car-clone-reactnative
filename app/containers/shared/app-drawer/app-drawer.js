// utils
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
  AsyncStorage,
} from 'react-native'
import { connect } from 'react-redux';
import { FBLoginManager } from 'react-native-facebook-login';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Collapsible from 'react-native-collapsible';
import { store } from '../../../store/store';
import { persistStore } from 'redux-persist';

// styles
import stylesColors from '../../../constants/colors';

// actions
import { logoutCurrentUser } from '../../../actions/session';
import { showModal } from '../../../actions/modals';

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    marginRight: 0,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: stylesColors.appDrawerAvatarBorder,
  },
  container: {
    flex: 1,
    backgroundColor: stylesColors.appDrawerBg,
  },
  dropdownLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: stylesColors.appDrawerDivider,
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 17,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  dropdownIcon: {
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: stylesColors.appDrawerUserContainerBg,
    borderRadius: 0,
    paddingTop: 15,
    padding: 10,
  },
  menuLink: {
    fontSize: 17,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: stylesColors.appDrawerDivider,
    borderBottomWidth: 1,
  },
  menuSublink: {
    fontSize: 15,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: stylesColors.appDrawerDivider,
    backgroundColor: stylesColors.appDrawerBg,
    borderBottomWidth: 1,
  },
  sessionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: stylesColors.userInfoContainerText,
  },
  sessionUserIcon: {
    color: stylesColors.userInfoContainerText,
    marginRight: 5,
  },
  userInfoContainer: {
    backgroundColor: stylesColors.appDrawerUserContainerBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfoText: {
    width: width - 290,
    fontSize: 18,
    fontWeight: 'bold',
    color: stylesColors.userInfoContainerText,
    margin: 10,
    marginTop: 0,
    marginBottom: 0,
  },
  userInfoNotificationIcon: {
    paddingTop: 10,
  },
  userInfo: {
    backgroundColor: stylesColors.appDrawerUserContainerBg,
    height: 100,
    padding: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  userInfoEmpty: {
    backgroundColor: stylesColors.appDrawerUserContainerBg,
    height: 80,
    padding: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
})

export class AppDrawer extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  state = {
    hideAccount: true,
  }

  goToAndClose(actionName, options = {}) {
    const { navigation } = this.props;

    navigation.navigate(actionName, options)
  }

  openModalAndClose(modalType, modalProps) {
    const { navigation, showModal } = this.props;

    showModal(modalType, modalProps)
    navigation.navigate('DrawerClose')
  }

  onLogout() {
    const { logoutCurrentUser, currentUser, navigation } = this.props

    logoutCurrentUser(currentUser)
      .then((response) => {
        // persistStore(store, {
        //   storage: AsyncStorage
        // }, () => {
        //   console.log('purge succeeded')
        // }).purge([
        //   'session',
        //   'currentUser',
        //   'ridesAsDriver',
        //   'ridesAsPassenger',
        //   'notifications',
        // ])

        // code below commented out because it's causing error "Can't find variable: Reflect"
        // when purging array of keys (purging all items with .purge() works fine)
        // Use code above when it's fixed
        // https://github.com/rt2zz/redux-persist/issues/263
        AsyncStorage.multiRemove([
          'reduxPersist:session',
          'reduxPersist:currentUser',
          'reduxPersist:ridesAsDriver',
          'reduxPersist:ridesAsPassenger',
          'reduxPersist:notifications',
        ])
      })
  }

  logout() {
    FBLoginManager.logout((data) => {
      this.onLogout()
    })
  }

  toggleAccountLinks() {
    this.setState({hideAccount: !this.state.hideAccount})
  }

  renderUserInfo() {
    const { currentUser } = this.props;

    if (currentUser) {
      return(
        <View style={styles.userInfoContainer}>
          <TouchableHighlight
            underlayColor={stylesColors.userInfoContainerBg}
            onPress={() => this.goToAndClose('myAccount', {})}
          >
            <View style={styles.userInfo}>
              <Image source={{uri: currentUser.avatar}} style={styles.avatar} />
              <View>
                <Text
                  style={styles.userInfoText}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {currentUser.first_name}
                </Text>
                {this.renderNotificationIcon()}
              </View>
            </View>
          </TouchableHighlight>
          <Icon.Button
            name="power-off"
            backgroundColor={stylesColors.userInfoContainerBg}
            underlayColor={stylesColors.userInfoContainerBg}
            iconStyle={styles.logoutButton}
            onPress={this.logout.bind(this)}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.userInfoEmpty}>
          <Icon
            name="user"
            backgroundColor={stylesColors.userInfoContainerBg}
            size={22}
            style={styles.sessionUserIcon}
          />
          <TouchableHighlight
            underlayColor={stylesColors.userInfoContainerBg}
            onPress={() => this.openModalAndClose('LOGIN', { title: 'Login' })}
          >
            <Text style={styles.sessionText}>Login</Text>
          </TouchableHighlight>
          <Text style={styles.sessionText}> / </Text>
          <TouchableHighlight
            underlayColor={stylesColors.userInfoContainerBg}
            onPress={() => this.openModalAndClose('REGISTER', { title: 'Create account' })}
          >
            <Text style={styles.sessionText}>Register</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  renderNotificationIcon() {
    return (
      <MaterialIcons.Button
        name="notifications-none"
        backgroundColor={stylesColors.userInfoContainerBg}
        size={25}
        style={styles.userInfoNotificationIcon}
        onPress={() => this.goToAndClose('myNotifications', {})}
      />
    )
  }

  renderSharedLinks() {
    return (
      <TouchableHighlight
        underlayColor={stylesColors.appDrawerBg}
        onPress={() => this.goToAndClose('rides')}
      >
        <Text style={styles.menuLink}>Rides</Text>
      </TouchableHighlight>
    )
  }

  renderAccountLinks() {
    return (
      <View>
        <Collapsible collapsed={this.state.hideAccount}>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('accountTabs', {})}
          >
            <Text style={styles.menuSublink}>My profile</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('myRidesAsPassenger', {})}
          >
            <Text style={styles.menuSublink}>My rides as passenger</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('myRidesAsDriver', {})}
          >
            <Text style={styles.menuSublink}>My rides as driver</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('myCars', {})}
          >
            <Text style={styles.menuSublink}>My cars</Text>
          </TouchableHighlight>
        </Collapsible>
      </View>
    )
  }

  renderDropdownIcon() {
    if (this.state.hideAccount) {
      return (
        <MaterialIcon
          name='arrow-drop-down'
          style={styles.dropdownIcon}
          backgroundColor={stylesColors.appDrawerBg}
          underlayColor={stylesColors.appDrawerBg}
          size={35}
        />
      )
    } else {
      return (
        <MaterialIcon
          name='arrow-drop-up'
          style={styles.dropdownIcon}
          backgroundColor={stylesColors.appDrawerBg}
          underlayColor={stylesColors.appDrawerBg}
          size={35}
        />
      )
    }
  }

  renderLoggedInAccountLinks() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return (
        <View>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.toggleAccountLinks()}
          >
            <View style={styles.dropdownLink}>
              <Text style={styles.dropdownText}>My account</Text>
              {this.renderDropdownIcon()}
            </View>
          </TouchableHighlight>
          {this.renderAccountLinks()}
        </View>
      )
    }
  }

  renderLoggedInLinks() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return (
        <View>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('usersIndex')}
          >
            <Text style={styles.menuLink}>Users</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={stylesColors.appDrawerBg}
            onPress={() => this.goToAndClose('settingsIndex')}
          >
            <Text style={styles.menuLink}>Settings</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderUserInfo()}
        {this.renderLoggedInAccountLinks()}
        {this.renderSharedLinks()}
        {this.renderLoggedInLinks()}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser.item,
    isStarted: state.currentUser.isStarted,
    isFetching: state.currentUser.isFetching,
    isAuthenticated: state.session.isAuthenticated,
  }
}

const mapDispatchToProps = {
  logoutCurrentUser,
  showModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer)
