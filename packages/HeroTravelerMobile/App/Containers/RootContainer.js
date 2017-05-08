import React, { Component, PropTypes } from 'react'
import { View, StatusBar, Linking } from 'react-native'
import HockeyApp from 'react-native-hockeyapp'
import { connect } from 'react-redux'
import { Router } from 'react-native-router-flux'

import OpenScreenActions from '../Redux/OpenScreenRedux'
import NavigationScenes from '../Navigation/NavigationRouter'
import StartupActions from '../Redux/StartupRedux'
import LoginActions from '../Redux/LoginRedux'
// import ReduxPersist from '../Config/ReduxPersist'
import styles from './Styles/RootContainerStyles'
import deeplinkToAction from '../Lib/deeplinkToAction'

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

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ConnectedRouter scenes={NavigationScenes} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.startup.started,
    isLoggedIn: state.login.isLoggedIn
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: (linkingAction) => {
    return dispatch(StartupActions.startup(linkingAction))
  },
  heroStartup: (linkAction) => dispatch(StartupActions.heroStartup(linkAction)),
  openScreen: (...args) => dispatch(OpenScreenActions.openScreen(...args)),
  verifyEmail: (token) => dispatch(LoginActions.verifyEmail(token))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
