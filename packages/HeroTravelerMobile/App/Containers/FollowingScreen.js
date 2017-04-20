
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
import SignupActions from '../Redux/SignupRedux'
import RoundedButton from '../Components/RoundedButton'
import Avatar from '../Components/Avatar'
import NavBar from './CreateStory/NavBar'
import styles from './Signup/SignupSocialStyles'

class FollowingScreen extends React.Component {

  static propTypes = {
    followers: PropTypes.array
  }

  componentDidMount() {
    this.props.loadFollowing()
  }

// TODO replace the function below as needed to match data. 
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
                  <RoundedButton
                    style={selected ? styles.selectedFollowersButton : styles.followersButton}
                    textStyle={selected ? styles.selectedFollowersButtonText : styles.followersButtonText}
                    text={selected ? 'FOLLOWING' : '+ FOLLOW'}
                    onPress={() => this.toggleFollow(u)}
                  />
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
          <Text style={styles.title}>FOLLOWING</Text>
          <Text style={styles.subtitle}>These are the people you are following!!</Text>
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
    loadFollowing: () => dispatch(UserActions.loadUserSuggestionsRequest()),
    // TODO below functions to be replaced
    followUser: (userId) => dispatch(SignupActions.signupFollowUser(userId)),
    unfollowUser: (userId) => dispatch(SignupActions.signupUnfollowUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowingScreen)
