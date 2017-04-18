
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Image, View} from 'react-native'

import {Images, Colors, Metrics} from '../Themes'
import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import StoryActions, {getByUser} from '../Redux/Entities/Stories'
import ProfileView from '../Components/ProfileView'
import styles from './Styles/ProfileScreenStyles'


class ReadOnlyProfileScreen extends React.Component {

  render () {
    const { userId, allStories, usersById, fetchStatus} = this.props

    let avatar

    const stories = getByUser(allStories, userId)
    const user = usersById[userId]

console.log('user', user)
    const storiesAsArray = _.map(stories, s => {
      return {
        ...s,
        author: user
      }
    })

    // Deals with the case that the user logs out
    // and this page is still mounted and rendering

    if (!user) {
      return null
    }

    return (
      <ProfileView
        user={user}
        stories={storiesAsArray}
        editable={false}
        hasTabbar={false}
        profileImage={Images.profile}
        fetchStatus={fetchStatus}
        style={styles.root}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {user} = state.session
  let {
    fetchStatus,
    entities: allStories,
    error
  } = state.entities.stories
  return {
    user: state.session.user,
    usersById: state.entities.users.entities,
    isLoggedIn: hasAuthData(state.session),
    apiTokens: state.session.tokens,
    fetchStatus,
    allStories,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens)),
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(SessionActions.refreshUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyProfileScreen)
