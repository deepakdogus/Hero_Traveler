import React, { Component } from 'react'
import { View, StatusBar, Linking } from 'react-native'
import HockeyApp from 'react-native-hockeyapp'
import { connect } from 'react-redux'
import { Router } from 'react-native-router-flux'

// import PerfMonitor from 'react-native/Libraries/Performance/RCTRenderingPerf'

import OpenScreenActions from '../Shared/Redux/OpenScreenRedux'
import NavigationScenes from '../Navigation/NavigationRouter'
import StartupActions from '../Shared/Redux/StartupRedux'
import LoginActions from '../Shared/Redux/LoginRedux'
import styles from './Styles/RootContainerStyles'
import deeplinkToAction from '../Shared/Lib/deeplinkToAction'

const ConnectedRouter = connect()(Router)

class RootContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      initialUrl: null
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

    HockeyApp.start()
    Linking.addEventListener('url', this._handleOpenURL);
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
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL = (event) => {
    const {url} = event
    const urlObj = deeplinkToAction(url)
    const isPasswordReset = urlObj.action === 'resetpassword'
    const isEmailVerify = urlObj.action === 'emailverify'
    if (!this.props.isLoggedIn && isPasswordReset) {
      this.props.openScreen('resetPassword', {
        type: 'push',
        token: urlObj.id
      })
    } else if (this.props.isLoggedIn && isPasswordReset) {
      alert('You must logout to reset a password from an email link')
    } else if (this.props.isLoggedIn && isEmailVerify) {
      this.props.verifyEmail(urlObj.id)
    } else if (!this.props.isLoggedIn && isEmailVerify) {
      alert('You must be logged in to verify your email address')
    }
  }

  isDarkProfile() {
    const location = this.props.location
    return location === 'profile' || location === 'readOnlyProfile' ||
    location === 'story'
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={this.isDarkProfile() ? 'dark-content' : 'light-content'} />
        <ConnectedRouter scenes={NavigationScenes} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.startup.started,
    isLoggedIn: state.login.isLoggedIn,
    location: state.routes.scene.name,
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
  setOrientation: (orientation) => dispatch(OrientationActions.setOrientation(orientation))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
