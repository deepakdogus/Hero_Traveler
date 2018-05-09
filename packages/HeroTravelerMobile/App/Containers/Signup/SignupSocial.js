import React from 'react'
import {
  ScrollView,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import SignupActions from '../../Shared/Redux/SignupRedux'
import UserActions, {getFollowers} from '../../Shared/Redux/Entities/Users'

import RoundedButton from '../../Components/RoundedButton'
import TabIcon from '../../Components/TabIcon'
import Avatar from '../../Components/Avatar'
import FollowFollowingRow from '../../Components/FollowFollowingRow'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {Colors} from '../../Shared/Themes'
import styles from './SignupSocialStyles'

class SignupSocialScreen extends React.Component {

  componentDidMount() {
    this.props.loadSuggestedPeople()
  }

  userIsFollowed(userId) {
    return _.includes(this.props.myFollowedUsers, userId)
  }

  render () {
    let content
    const {sessionUser, followUser, unfollowUser} = this.props
    if (_.values(this.props.users).length) {
      content = (
        <View style={styles.lightBG}>
        {
          // <Text style={styles.sectionHeader}>FIND FRIENDS</Text>
          // <View style={styles.rowWrapper}>
          //   <View style={styles.row}>
          //     <TabIcon
          //       name='facebook'
          //       style={{
          //         image: {tintColor: Colors.facebookBlue},
          //         view: {paddingHorizontal: 5.5},
          //       }}
          //     />
          //     <Text style={styles.connectSocialText}>Facebook</Text>
          //     <View style={styles.connectWrapper}>
          //       {sessionUser && sessionUser.isFacebookConnected && <Text style={styles.isConnectedText}>Connected</Text>}
          //       <Icon name='angle-right' size={15} color={'#757575'} />
          //     </View>
          //   </View>
          // </View>
          // <View style={styles.rowWrapper}>
          //   <View style={styles.row}>
          //     <TabIcon
          //       name='twitter'
          //       style={{
          //         image: {tintColor: Colors.twitterBlue},
          //         view: {paddingHorizontal: 1},
          //       }}
          //     />
          //     <Text style={styles.connectSocialText}>Twitter</Text>
          //     <View style={styles.connectWrapper}>
          //       <Icon name='angle-right' size={15} color={'#757575'} />
          //     </View>
          //   </View>
          // </View>
          // <View style={styles.rowWrapper}>
          //   <View style={styles.row}>
          //     <Icon name='instagram' size={25} color={Colors.twitterBlue} style={{paddingLeft: .5}} />
          //     <Text style={styles.connectSocialText}>Instagram</Text>
          //     <View style={styles.connectWrapper}>
          //       <Icon name='angle-right' size={15} color='#757575' />
          //     </View>
          //   </View>
          // </View>
        }
          <Text style={styles.sectionHeader}>SUGGESTED PEOPLE</Text>
          <View>
          {_.map(this.props.suggestedUsersById).map(uid => {
            const user = this.props.users[uid]
            return (
              <FollowFollowingRow
                isSignup
                key={user.id}
                sessionUserId={sessionUser.id}
                user={user}
                isFollowing={this.userIsFollowed(user.id)}
                followUser={followUser}
                unfollowUser={unfollowUser}
              />
            )
          })}
          </View>
        </View>
      )
    } else {
      content = (
        <Text>No users yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.header}>
          <Text style={styles.title}>FOLLOW</Text>
          <Text style={styles.subtitle}>Follow people to see their stories</Text>
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
  const users = state.entities.users.entities
  const sessionUserId = state.session.userId
  return {
    sessionUser: users[sessionUserId],
    users,
    suggestedUsersById: state.entities.users.suggestedUsersById,
    myFollowedUsers: getFollowers(state.entities.users, 'following', sessionUserId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSuggestedPeople: () => dispatch(UserActions.loadUserSuggestionsRequest()),
    followUser: (sessionUserId, userIdToFollow) => dispatch(UserActions.followUser(sessionUserId, userIdToFollow)),
    unfollowUser: (sessionUserId, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserId, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupSocialScreen)
