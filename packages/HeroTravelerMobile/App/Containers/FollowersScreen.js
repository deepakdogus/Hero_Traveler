import React, { PropTypes } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import {connect} from 'react-redux'
import _ from 'lodash'

// TODO create redux action to load followers or else load all users and filter for followers
// on the front end.

import UserActions from '../Redux/Entities/Users'
import Avatar from '../Components/Avatar'
import NavBar from './CreateStory/NavBar'
import styles from './Signup/SignupSocialStyles'

class FollowersScreen extends React.Component {

  static propTypes = {
    followers: PropTypes.array
  }

  componentDidMount() {
    this.props.loadFollowers()
  }

  // TODO replace the function below if necessary.
  /* It exists right now so that the signup data does not throw an error, but it isn't being used*/

  userIsSelected(user) { 
    return _.includes(this.props.selectedUsersById, user.id)
  }

  render () {
    let content

    if (_.values(this.props.users).length) {
      content = (
        <View style={styles.lightBG}>
          {_.values(this.props.users).map(u => {
            const selected = !this.userIsSelected(u)
            return (
              <View style={[styles.rowWrapper]} key={u.id}>
                <View style={[styles.row, styles.followers]}>
                  <TouchableOpacity onPress={() => NavActions.readOnlyProfile({userId: u.id})}>
                  <Avatar
                    style={styles.avatar}
                    avatarUrl={u.profile.avatar}
                  />
                  </TouchableOpacity>
                  <View style={styles.nameWrapper}>
                    <Text style={styles.name}>{u.profile.fullName}</Text>
                    <Text style={styles.followerCount}>{u.counts.following} followers</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      )
    } else {
      content = (
        <Text>No Followers yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.root]}>
          <NavBar
            leftTitle='Back'
            onLeft={() => NavActions.pop()}
          />
        <View style={styles.header}>
          <Text style={styles.title}>FOLLOWERS</Text>
          <Text style={styles.subtitle}>These are the people following you</Text>
        </View>
        {content}
      </ScrollView>
    )
  }

  toggleFollow = (u) => {
    const isSelected = this.userIsSelected(u)
    if (!isSelected) {
      this.props.followUser(u.id)
    } else {
      this.props.unfollowUser(u.id)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.entities.users.entities,
    selectedUsersById: state.signup.selectedUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadFollowers: () => dispatch(UserActions.loadUserSuggestionsRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersScreen)
