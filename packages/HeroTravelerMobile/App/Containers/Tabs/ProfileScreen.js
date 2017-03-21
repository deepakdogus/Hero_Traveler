import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions, ActionConst as NavActionConst } from 'react-native-router-flux'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import RoundedButton from '../../Components/RoundedButton'

import StoryActions from '../../Redux/StoryRedux.js'
import StoryList from '../../Components/StoryList'
import styles from '../Styles/MyFeedScreenStyles'

class ProfileScreen extends React.Component {

  componentDidMount() {
    this.props.attemptGetUserStories(this.props.user._id)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isLoggedIn && !newProps.isLoggedIn) {
      NavActions.launchScreen({type: NavActionConst.REPLACE})
    }
  }

  render () {
    return (
      <View style={styles.containerWithNavbar}>
        <Text style={styles.title}>Profile</Text>
        <RoundedButton
          onPress={() => this.props.logout(this.props.apiTokens)}
          text='Logout'
        />
        <RoundedButton
          onPress={this._getMyToken}
          text='Token'
        />
        {this.props.posts &&
          <StoryList
            stories={this.props.posts}
            height={200}
            onPressStory={story => alert(`Story ${story._id} pressed`)}
            onPressLike={story => alert(`Story ${story._id} liked`)}
          />
        }
      </View>
    )
  }

  _getMyToken = () => {
    return alert(JSON.stringify(this.props.apiTokens))
  }
}

const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    isLoggedIn: hasAuthData(state.session),
    apiTokens: state.session.tokens,
    fetching,
    posts,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    user: state.auth.user,
    logout: (tokens) => dispatch(SessionActions.logout(tokens)),
    attemptGetUserStories: (userId) => dispatch(StoryActions.fromUserRequest(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
