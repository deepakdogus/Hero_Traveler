
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Images, Colors} from '../Themes'
import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import StoryActions, {getByUser} from '../Redux/Entities/Stories'
import ProfileView from '../Components/ProfileView'
import styles from './Styles/ProfileScreenStyles'


class ReadOnlyProfileScreen extends React.Component {
  componentDidMount() {
    this.props.attemptRefreshUser()
    this.props.attemptGetUserStories(this.props.user.id)
  }

  render () {
    const {user, stories, storyFetchStatus} = this.props
    let avatar

    const storiesAsArray = _.map(stories, s => {
      return {
        ...s
      }
    })

    // Deals with the case that the user logs out
    // and this page is still mounted and rendering

    if (!user) {
      return null
    }

    if (user.profile.avatar) {
      avatar = (
        <Image
          style={styles.avatarImage}
          source={{uri: user.profile.avatar}}
        />
      )
    } else {
      avatar = (
        <Icon name="user-circle-o" color={Colors.snow} size={40} />
      )
    }

    return (
      <ProfileView
        user={user}
        avatar={avatar}
        stories={storiesAsArray}
        editable={false}
        profileImage={Images.profile}
        fetchStatus={storyFetchStatus}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {user} = state.session
  const userId = user ? user.id : null
  let {
    fetchStatus,
    entities: stories,
    error
  } = state.entities.stories
  return {
    user: state.session.user,
    usersById: state.entities.users.entities,
    isLoggedIn: hasAuthData(state.session),
    apiTokens: state.session.tokens,
    storyFetchStatus: fetchStatus,
    stories: getByUser(stories, userId),
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
