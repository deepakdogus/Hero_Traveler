import React from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import {Colors} from '../Themes'
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

const List = ({children}) => {
  return (
    <View style={styles.list}>
      {children}
    </View>
  )
}

class SettingsScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggingOut: false
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isLoggedIn && !newProps.isLoggedIn) {
      NavActions.launchScreen({type: NavActionConst.RESET})
    }
  }

  _logOut = () => {
    this.setState({loggingOut: true})
    this.props.logout(this.props.user.id)
  }

  render () {
    const user = this.props.user || {}

    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.separator} />
          <List>
            <Row
              icon={<Icon name='facebook' size={15} color={Colors.facebookBlue} />}
              text='Facebook'
              connected={user.isFacebookConnected}
              onPress={() => alert('facebook!')}
            />
            <Row
              icon={<Icon name='twitter' size={15} color={Colors.twitterBlue} />}
              text='Twitter'
              connected={user.isTwitterConnected}
              onPress={() => alert('twitter!')}
            />
          </List>
          <View style={styles.separator} />
          <List>
            <Row
              text='Change Password'
              onPress={() => alert('change password')}
            />
            <Row
              text='Notifications'
              onPress={() => alert('notifications')}
            />
          </List>
          <View style={styles.separator} />
          <List>
          <Row
            text='FAQ'
            onPress={() => alert('FAQ')}
          />
          <Row
            text='Terms & Conditions'
            onPress={() => alert('Terms & Conditions')}
          />
          <Row
            text='Sign Out'
            hideAngleRight={true}
            onPress={() => this.props.logout(this.props.tokens)}
            textStyle={{color: Colors.red}}
          />
          </List>
        </ScrollView>
        {this.state.loggingOut &&
          <Loader tintColor={Colors.blackoutTint} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }} />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    isLoggedIn: hasAuthData(state.session),
    tokens: state.session.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
