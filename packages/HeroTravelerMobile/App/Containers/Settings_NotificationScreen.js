import React from 'react'
import {
  View,
  Switch,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

const notificationOpts = [
  ['New Follower', 'user_new_follower'],
  ['Story Liked', 'story_like'],
  ['New Comments', 'story_comment'],
]

import styles from './Styles/SettingsScreenStyles'
import UserActions from '../Redux/Entities/Users'

const Row = ({text, selected, onPress}) => {
  return (
    <View style={styles.rowWrapper}>
      <View style={styles.row}>
        <Text style={[styles.rowText, {flexGrow: 1, color: 'black'}]}>{text}</Text>
        <Switch value={selected} onValueChange={onPress} />
      </View>
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

class NotificationsSettingsScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTypes: this.props.user.notificationTypes
    }
  }

  render () {
    const user = this.props.user || {}
    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <List>
          {_.map(notificationOpts, ([label, value]) => {
            return (
              <Row
                key={value}
                text={label}
                onPress={() => this._changeVal(value)}
                selected={_.includes(this.state.selectedTypes, value)}
              />
            )
          })}
        </List>
      </View>
    )
  }

  _changeVal = (val) => {
    let newTypes
    if (_.includes(this.state.selectedTypes, val)) {
      newTypes = _.without(this.state.selectedTypes, val)
    } else {
      newTypes = this.state.selectedTypes.concat(val)
    }
    this.setState({selectedTypes: newTypes})
    this.props.updateUser({notificationTypes: newTypes})
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsSettingsScreen)
