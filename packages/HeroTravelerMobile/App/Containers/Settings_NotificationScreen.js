import React from 'react'
import {
  View,
  Switch,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import {withHandlers} from 'recompose'

const notificationOpts = [
  ['New Follower', 'user_new_follower'],
  ['Story Liked', 'story_like'],
  ['New Comments', 'story_comment'],
]

import styles from './Styles/SettingsScreenStyles'
import UserActions from '../Shared/Redux/Entities/Users'

const enhancedRow = withHandlers({
  onValChange: props => () => {
    props.onPress(props.value)
  }
})

const Row = enhancedRow(({text, selected, onValChange}) => {
  return (
    <View style={styles.rowWrapper}>
      <View style={styles.row}>
        <Text style={[styles.rowText, {flexGrow: 1, color: 'black'}]}>{text}</Text>
        <Switch onTintColor="red" value={selected} onValueChange={onValChange} />
      </View>
    </View>
  )
})

const RowList = ({children}) => {
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
    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <Text style={styles.settingsLabel}>Push Notifications</Text>
        <RowList>
          {_.map(notificationOpts, ([label, value]) => {
            return (
              <Row
                key={value}
                text={label}
                value={value}
                onPress={this._changeVal}
                selected={_.includes(this.state.selectedTypes, value)}
              />
            )
          })}
        </RowList>
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
