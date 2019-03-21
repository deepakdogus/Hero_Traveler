import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StatusBar, Linking } from 'react-native'
import HockeyApp from 'react-native-hockeyapp'
import { connect } from 'react-redux'
import {
  Router,
  Actions as NavActions,
  ActionConst as NavActionConst,
} from 'react-native-router-flux'
import branch from 'react-native-branch'

// import PerfMonitor from 'react-native/Libraries/Performance/RCTRenderingPerf'

import AddStoryModal from '../Components/AddStoryModal'
import UXActions from '../Redux/UXRedux'
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
    isAddStoryModalOpen: PropTypes.bool,
    closeAddStoryModal: PropTypes.func,
    openAddStoryModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      initialUrl: null,
    }
  }

  componentWillMount() {
    HockeyApp.configure('26a928f9ecc44c0baf17350581dc9405')
  }

  async componentDidMount() {
    // PerfMonitor.toggle();
    // setTimeout(() => {
      //   PerfMonitor.start();
      //   setTimeout(() => {
        //     PerfMonitor.stop();
        //   }, 14000);
        // }, 5000);

    this._initializeDeepLinking()

    HockeyApp.start()
    Linking.addEventListener('url', this._handleOpenURL)
    return Linking.getInitialURL().then((url) => {
      this.setState({initialUrl: url})
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

  _handleOpenURL = (event) => {
    const {url} = event
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
    NavActions.tabbar({type: NavActionConst.RESET})
    NavActions.story({ storyId, title })
  }

  _navToGuideFromOutsideLink = (guideId, title) => {
    NavActions.tabbar({type: NavActionConst.RESET})
    NavActions.guide({ guideId, title })
  }

  isLightStatusBarText() {
    const { location } = this.props
    return location === 'signup'
      || location === 'launchScreen'
      || location === 'login'
  }

  _addStory = () => {
    const { closeAddStoryModal } = this.props
    NavActions.createStoryFlow({
      type: 'push',
      shouldLoadStory: true,
    })
    closeAddStoryModal()
  }

  _addSlideshow = () => {
    const { closeAddStoryModal } = this.props
    NavActions.createStoryFlow({ type:'push' })
    NavActions.createStory_slideshow({ shouldLoadStory: true, type:'push' })
    closeAddStoryModal()
  }

  render () {
    const { isAddStoryModalOpen, closeAddStoryModal } = this.props
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={
          this.isLightStatusBarText()
            ? 'light-content'
            : 'dark-content'
          } />
        <AddStoryModal
          closeModal={closeAddStoryModal}
          showModal={isAddStoryModalOpen}
          addStory={this._addStory}
          addSlideshow={this._addSlideshow}
        />
        <ConnectedRouter
        >
          {NavigationScenes(this.props)}
        </ConnectedRouter>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let location = state.routes.scene.name
  if (location === 'tabbar' && state.routes.scene.index === 4) location = 'profile'
  const isAddStoryModalOpen = state.ux.modalName === 'newStory'

  return {
    started: state.startup.started,
    isLoggedIn: state.login.isLoggedIn,
    location: location || '',
    isAddStoryModalOpen,
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: (linkingAction) => {
    return dispatch(StartupActions.startup(linkingAction))
  },
  heroStartup: (linkAction) => dispatch(StartupActions.heroStartup(linkAction)),
  openScreen: (...args) => dispatch(OpenScreenActions.openScreen(...args)),
  verifyEmail: (token) => dispatch(LoginActions.verifyEmail(token)),
  closeAddStoryModal: () => dispatch(UXActions.closeGlobalModal()),
  openAddStoryModal: () => dispatch(UXActions.openGlobalModal('newStory')),
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
