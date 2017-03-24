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

const Row = ({icon, text, textStyle, connected, hideAngleRight, onPress}) => {
  return (
    <View style={styles.rowWrapper}>
      <TouchableOpacity style={styles.row} onPress={onPress}>
        {icon}
        <Text style={[styles.rowText, textStyle]}>{text}</Text>
        {!hideAngleRight &&
          <View style={styles.connectWrapper}>
            {connected && <Text style={styles.isConnectedText}>Connected</Text>}
            <Icon name='angle-right' size={15} color={'#757575'} />
          </View>
        }
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

  componentWillReceiveProps(newProps) {
    if (this.props.isLoggedIn && !newProps.isLoggedIn) {
      NavActions.launchScreen({type: NavActionConst.RESET})
    }
  }

  render () {
    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.separator} />
        <List>
          <Row
            icon={<Icon name='facebook' size={15} color={Colors.facebookBlue} />}
            text='Facebook'
            onPress={() => alert('facebook!')}
          />
          <Row
            icon={<Icon name='twitter' size={15} color={Colors.twitterBlue} />}
            text='twitter'
            onPress={() => alert('twitter!')}
          />
          <Row
            icon={<Icon name='instagram' size={15} />}
            text='Instagram'
            onPress={() => alert('instagram!')}
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
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
