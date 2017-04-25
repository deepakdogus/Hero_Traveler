
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Image, View} from 'react-native'

import {Images, Colors, Metrics} from '../Themes'
import UserActions from '../Redux/Entities/Users'
import StoryActions, {getIdsByUser} from '../Redux/Entities/Stories'
import ProfileView from '../Components/ProfileView'
import getImageUrl from '../Lib/getImageUrl'
import styles from './Styles/ProfileScreenStyles'


class ReadOnlyProfileScreen extends React.Component {

  componentDidMount() {
    this.props.attemptGetUserStories(this.props.userId)
  }

  render () {
    const { userId, user, storiesById, fetchStatus} = this.props

    return (
      <ProfileView
        user={user}
        stories={storiesById}
        editable={false}
        hasTabbar={false}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={fetchStatus}
        style={styles.root}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {userId} = state.session
  let {
    fetchStatus,
    entities: allStories,
    error
  } = state.entities.stories
  return {
    user: state.entities.users.entities[userId],
    storiesById: getIdsByUser(state.entities.stories, userId),
    fetchStatus,
    allStories,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(UserActions.loadUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyProfileScreen)
