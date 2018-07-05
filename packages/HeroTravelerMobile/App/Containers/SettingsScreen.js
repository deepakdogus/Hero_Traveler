import React from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ActionConst as NavActionConst,
  Actions as NavActions,
} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import VersionNumber from 'react-native-version-number'

import SessionActions from '../Shared/Redux/SessionRedux'
import UserActions from '../Shared/Redux/Entities/Users'
import {Colors} from '../Shared/Themes'
import styles from './Styles/SettingsScreenStyles'
import Loader from '../Components/Loader'

const Row = ({icon, text, textStyle, connected, hideAngleRight, onPress}) => {
  return (
    <View style={styles.rowWrapper}>
      <TouchableOpacity style={styles.row} onPress={onPress}>
        {icon}
        <Text style={[styles.rowText, textStyle]}>{text}</Text>
        {connected &&
          <View style={styles.connectWrapper}>
            <Text style={styles.isConnectedText}>Connected</Text>
          </View>
        }
        {!hideAngleRight && <Icon name='angle-right' size={15} color={'#757575'} />}
      </TouchableOpacity>
    </View>
  )
}

const NavList = ({children}) => {
  return (
    <View style={styles.list}>
      {children}
    </View>
  )
}

const Version = ({version}) =>
  <View style={styles.version}>
    <Text style={styles.versionText}>Version {version}</Text>
  </View>

class SettingsScreen extends React.Component {

  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    resetStore: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    connectFacebook: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(newProps) {
    // Go to launch page and reset all store state on
    if (this.props.isLoggedIn && !newProps.isLoggedIn) {
      NavActions.launchScreen({type: NavActionConst.RESET})
      this.props.resetStore()
    }

    if (newProps.error && !newProps.isLoggingOut) {
      let errorMessage = newProps.error.message || 'Operation could not be completed.'
      Alert.alert('Error', errorMessage, [{
        text: 'OK', onPress: () => {
          this.props.clearErrors()
        }
      }])
    }
  }

  _logOut = () => {
    this.props.logout(this.props.user.id)
  }

  _tapFacebook = () => {
    const user = this.props.user || {}
    if (user.isFacebookConnected) {
      alert('Your account is already connected to Facebook')
    } else {
      this.props.connectFacebook()
    }
  }

  _deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.props.deleteUser()
        }},
      ]
    )
  }

  render () {
    const user = this.props.user || {}

    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.separator} />
          <NavList>
            <Row
              icon={<Icon name='facebook' size={22} color={Colors.facebookBlue} />}
              text='Facebook'
              connected={user.isFacebookConnected}
              onPress={this._tapFacebook}
            />
            {/*<Row
              icon={<Icon name='twitter' size={22} color={Colors.twitterBlue} />}
              text='Twitter'
              connected={user.isTwitterConnected}
              onPress={this._tapTwitter}
            />*/}
          </NavList>
          <View style={styles.separator} />
          <NavList>
            <Row
              text='Change Password'
              onPress={NavActions.changePassword}
            />
            <Row
              text='Change Email Address'
              onPress={NavActions.changeEmail}
            />
            <Row
              text='Notifications'
              onPress={NavActions.settings_notification}
            />
          </NavList>
          <View style={styles.separator} />
          <NavList>
            <Row
              text='FAQ'
              onPress={NavActions.FAQ}
            />
            <Row
              text='Terms & Conditions'
              onPress={NavActions.terms}
            />
            <Row
              text='Privacy Policy'
              onPress={NavActions.privacy}
            />
            <Row
              text='Sign Out'
              hideAngleRight={true}
              onPress={this._logOut}
              textStyle={{color: Colors.red}}
            />
          </NavList>
          <View style={styles.separator} />
          <NavList>
            <Row
              text='Delete Account'
              onPress={this._deleteAccount}
              hideAngleRight={true}
            />
          </NavList>
          <Version version={VersionNumber.appVersion} />
        </ScrollView>
        {this.props.fetching &&
          <Loader
          tintColor={Colors.blackoutTint}
          style={styles.spinner}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    isLoggedIn: !state.session.isLoggedOut,
    loggingOut: state.session.isLoggingOut,
    tokens: state.session.tokens,
    error: state.entities.users.error,
    fetching: state.entities.users.fetchStatus.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens)),
    resetStore: () => dispatch(SessionActions.resetRootStore()),
    connectFacebook: () => dispatch(UserActions.connectFacebook()),
    deleteUser: () => dispatch(UserActions.deleteUser()),
    clearErrors: () => dispatch(UserActions.clearErrors()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
