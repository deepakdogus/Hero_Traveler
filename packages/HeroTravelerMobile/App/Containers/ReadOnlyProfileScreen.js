
import _ from 'lodash'
import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Image, View} from 'react-native'

import {Images, Colors, Metrics} from '../Themes'
import UserActions from '../Redux/Entities/Users'
import StoryActions, {getByUser, getUserFetchStatus} from '../Redux/Entities/Stories'
import ProfileView from '../Components/ProfileView'
import Loader from '../Components/Loader'
import getImageUrl from '../Lib/getImageUrl'
import styles from './Styles/ProfileScreenStyles'


class ReadOnlyProfileScreen extends Component {

  static propTypes = {
    userId: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.props.attemptRefreshUser(this.props.userId)
    this.props.attemptGetUserStories(this.props.userId)
  }

  render () {
    const {
      userId,
      user,
      storiesById,
      userFetchStatus,
      storiesFetchStatus
    } = this.props

    if (userFetchStatus.loading) {
      return (
        <Loader
          style={styles.spinner}
          tintColor={Colors.blackoutTint}
          spinnerColor={Colors.snow}
        />
      )
    }

    return (
      <ProfileView
        user={user}
        stories={storiesById}
        editable={false}
        hasTabbar={false}
        profileImage={getImageUrl(user.profile.cover)}
        fetchStatus={storiesFetchStatus}
        style={styles.root}
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.entities.users.entities[props.userId],
    storiesById: getByUser(state.entities.stories, props.userId),
    storiesFetchStatus: getUserFetchStatus(state.entities.stories, props.userId),
    userFetchStatus: state.entities.users.fetchStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId)),
    attemptRefreshUser: (userId) => dispatch(UserActions.loadUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyProfileScreen)
