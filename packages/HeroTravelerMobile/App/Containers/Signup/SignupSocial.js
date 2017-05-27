import React from 'react'
import {
  ScrollView,
  Image,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import SignupActions from '../../Redux/SignupRedux'
import UserActions from '../../Redux/Entities/Users'

import RoundedButton from '../../Components/RoundedButton'
import Avatar from '../../Components/Avatar'
import getImageUrl from '../../Lib/getImageUrl'
import {Colors} from '../../Themes'
import styles from './SignupSocialStyles'

class SignupSocialScreen extends React.Component {

  componentDidMount() {
    this.props.loadSuggestedPeople()
  }

  userIsSelected(user) {
    return _.includes(this.props.selectedUsersById, user.id)
  }

  render () {
    let content

    if (_.values(this.props.users).length) {
      content = (
        <View style={styles.lightBG}>
          <Text style={styles.sectionHeader}>FIND FRIENDS</Text>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='facebook'
                size={25}
                color={Colors.facebookBlue} />
              <Text style={styles.connectSocialText}>Facebook</Text>
              <View style={styles.connectWrapper}>
                <Text style={styles.isConnectedText}>Connected</Text>
                <Icon name='angle-right' size={15} color={'#757575'} />
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='twitter' size={25} color={Colors.twitterBlue} />
              <Text style={styles.connectSocialText}>Twitter</Text>
              <View style={styles.connectWrapper}>
                <Icon name='angle-right' size={15} color={'#757575'} />
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='instagram' size={25} color={Colors.twitterBlue} />
              <Text style={styles.connectSocialText}>Instagram</Text>
              <View style={styles.connectWrapper}>
                <Icon name='angle-right' size={15} color='#757575' />
              </View>
            </View>
          </View>
          <Text style={styles.sectionHeader}>SUGGESTED PEOPLE</Text>
          {_.map(this.props.suggestedUsersById).map(uid => {
            const u = this.props.users[uid]
            const selected = this.userIsSelected(u)
            return (
              <View style={[styles.rowWrapper]} key={u.id}>
                <View style={[styles.row, styles.followers]}>
                  <Avatar
                    style={styles.avatar}
                    avatarUrl={getImageUrl(u.profile.avatar)}
                  />
                  <View style={styles.nameWrapper}>
                    <Text style={styles.name}>{u.profile.fullName}</Text>
                    <Text style={styles.followerCount}>{u.counts.followers} followers</Text>
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
        <Text>No users yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.header}>
          <Text style={styles.title}>FOLLOW</Text>
          <Text style={styles.subtitle}>Follow people to see their trips</Text>
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
    suggestedUsersById: state.entities.users.suggestedUsersById,
    selectedUsersById: state.signup.selectedUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSuggestedPeople: () => dispatch(UserActions.loadUserSuggestionsRequest()),
    followUser: (userId) => dispatch(SignupActions.signupFollowUser(userId)),
    unfollowUser: (userId) => dispatch(SignupActions.signupUnfollowUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupSocialScreen)
