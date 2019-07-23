import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StatusBar, Linking } from 'react-native'
import { connect } from 'react-redux'
import {
  Router,
  Actions as NavActions,
  ActionConst as NavActionConst,
} from 'react-native-router-flux'
import branch from 'react-native-branch'
import DeviceInfo from 'react-native-device-info'

import OpenScreenActions from '../Shared/Redux/OpenScreenRedux'
import NavigationScenes from '../Navigation/NavigationRouter'
import StartupActions from '../Shared/Redux/StartupRedux'
import LoginActions from '../Shared/Redux/LoginRedux'
import styles from './Styles/RootContainerStyles'
import deeplinkToAction from '../Shared/Lib/deeplinkToAction'
import { parseNonBranchURL } from '../Lib/sharingMobile'

const ConnectedRouter = connect()(Router)

class RootContainer extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    started: PropTypes.bool,
    location: PropTypes.string,
    heroStartup: PropTypes.func,
    openScreen: PropTypes.func,
    verifyEmail: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      initialUrl: null,
      needToUpdateIOS: false,
    }
  }

  async componentDidMount() {
    if (!__DEV__) {
      const { needToUpdateIOS } = this.state
      if (!needToUpdateIOS) {
        const systemVersion = DeviceInfo.getSystemVersion().split('.')
        const newestIOS = 12 //manually add the latest iOS version here
        if (newestIOS - Number(systemVersion[0]) >= 1)
          this.setState({ needToUpdateIOS: true })
      }
    }

    this._initializeDeepLinking()

    this.props.startup()
    Linking.addEventListener('url', this._handleOpenURL)
    return Linking.getInitialURL().then(url => {
      this.setState({ initialUrl: url })
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.started && newProps.started) {
      this.props.heroStartup(deeplinkToAction(this.state.initialUrl))
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL)
  }

  updateIOSNotice() {
    const systemVersion = DeviceInfo.getSystemVersion()
    if (!this.alertPresent) {
      this.alertPresent = true
      Alert.alert(
        'Update Available',
        `Your iOS version ${systemVersion} is outdated. For optimal performance, `
          + `we recommend that you update to the latest version.`,
        [
          {
            text: 'Continue',
            onPress: () =>
              this.setState({
                needToUpdateIOS: false,
                needToUpdateIOSAlertOnce: true,
              }),
          },
        ],
      )
    }
  }

  _handleOpenURL = event => {
    const { url } = event
    const urlObj = deeplinkToAction(url)
    const isPasswordReset = urlObj.action === 'resetpassword'
    const isEmailVerify = urlObj.action === 'emailverify'
    if (!this.props.isLoggedIn && isPasswordReset) {
      this.props.openScreen('resetPassword', {
        type: 'push',
        token: urlObj.id,
      })
    }
    else if (this.props.isLoggedIn && isPasswordReset) {
      alert('You must logout to reset a password from an email link')
    }
    else if (this.props.isLoggedIn && isEmailVerify) {
      this.props.verifyEmail(urlObj.id)
    }
    else if (!this.props.isLoggedIn && isEmailVerify) {
      alert('You must be logged in to verify your email address')
    }
  }

  //deep linking logic
  _initializeDeepLinking = () => {
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }
      if (!this.props.isLoggedIn) return
      if (params['+non_branch_link']) {
        //facebook/twitter (non-branch) link routing
        let obj = parseNonBranchURL(params['+non_branch_link'])
        obj['storyId']
          ? this._navToStoryFromOutsideLink(obj['storyId'], obj['title'])
          : this._navToGuideFromOutsideLink(obj['guideId'], obj['title'])
        return
      }
      if (!params['+clicked_branch_link']) {
        return
      }
      //branch deep link routing
      const title = params.$og_title
      const feedItemType = params.$canonical_url.split('/')[0]
      const feedItemId = params.$canonical_url.split('/')[1]
      feedItemType === 'story'
        ? this._navToStoryFromOutsideLink(feedItemId, title)
        : this._navToGuideFromOutsideLink(feedItemId, title)
    })
  }

  _navToStoryFromOutsideLink = (storyId, title) => {
    NavActions.tabbar({ type: NavActionConst.RESET })
    NavActions.story({ storyId, title })
  }

  _navToGuideFromOutsideLink = (guideId, title) => {
    NavActions.tabbar({ type: NavActionConst.RESET })
    NavActions.guide({ guideId, title })
  }

  isLightStatusBarText() {
    const { location } = this.props
    return (
      location === 'signup'
      || location === 'launchScreen'
      || location === 'login'
    )
  }

  render() {
    const { needToUpdateIOS } = this.state
    return (
      <View style={styles.applicationView}>
        {needToUpdateIOS && this.updateIOSNotice()}
        <StatusBar
          barStyle={
            this.isLightStatusBarText() ? 'light-content' : 'dark-content'
          }
        />
        <ConnectedRouter scenes={NavigationScenes} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  let location = state.routes.scene.name
  if (location === 'tabbar' && state.routes.scene.index === 4)
    location = 'profile'

  return {
    started: state.startup.started,
    isLoggedIn: state.login.isLoggedIn,
    location: location || '',
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: linkingAction => {
    return dispatch(StartupActions.startup(linkingAction))
  },
  heroStartup: linkAction => dispatch(StartupActions.heroStartup(linkAction)),
  openScreen: (...args) => dispatch(OpenScreenActions.openScreen(...args)),
  verifyEmail: token => dispatch(LoginActions.verifyEmail(token)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootContainer)
