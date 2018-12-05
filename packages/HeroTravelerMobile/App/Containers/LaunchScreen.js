import React from 'react'
import PropTypes from 'prop-types'
import { Text, Image, ImageBackground, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
  ActionConst as NavActionConst,
} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'

import {hasAuthData} from '../Shared/Redux/SessionRedux'
import SignupActions, {hasSignedUp} from '../Shared/Redux/SignupRedux'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import { Images, Colors } from '../Shared/Themes'
import Loader from '../Components/Loader'
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends React.Component {
  static propTypes = {
    fetching: PropTypes.bool,
    hasHeroAccessToken: PropTypes.bool,
    hasSignedUp: PropTypes.bool,
    signupFacebook: PropTypes.func,
    splashShown: PropTypes.bool,
    sessionError: PropTypes.string,
    fromStory: PropTypes.bool,
    fromGuide: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      facebookLoggedIn: false,
      animationValue: new Animated.Value(0),
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.state.facebookLoggedIn
      && !newProps.fetching
      && newProps.hasSignedUp
    ) {
      // if user has stored session data on device, treat as a login
      if (this.props.hasHeroAccessToken) {
        NavigationActions.tabbar({type: 'reset'})
        NavigationActions.myFeed()
      }
      else {
        NavigationActions.signupFlow()
      }
    }

    if (this.props.splashShown && !newProps.splashShown && !this.props.hasHeroAccessToken) {
      SplashScreen.hide()
      this.fadeIn()
    }
  }

  componentDidMount() {
    SplashScreen.hide()
    this.fadeIn()
  }

  _signupFacebook = () => {
    this.props.signupFacebook()
    this.setState({facebookLoggedIn: true})
  }

  _navToSignup = () => {
    NavigationActions.signup()
  }

  _navToLogin = () => {
    const { fromStory, fromGuide } = this.props
    NavigationActions.login({ fromStory, fromGuide })
  }

  fadeIn() {
    Animated.timing(
      this.state.animationValue,
      {
        toValue: 1,
        duration: 1500,
      },
    ).start()
  }

  render () {
    return (
      <ImageBackground
        source={Images.launchBackground}
        style={[styles.backgroundImage]}
      >
        <Animated.View style={{flex: 1, opacity: this.state.animationValue}}>
        <View style={[styles.logoSection]}>
          <Image source={Images.whiteLogo} style={styles.logo} />
          <Text
            style={styles.tagline}
            textAlign='center'
          >{'For Travelers, By Travelers'}</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.signupButtons}>
          <RoundedButton
            style={styles.facebook}
            onPress={this._signupFacebook}
            icon='facebook'
            iconStyle={styles.facebookIcon}
            text='Sign up with Facebook'
            textStyle={[styles.baseTextStyle, styles.facebookTextStyle]}
          />
          <RoundedButton
            style={styles.email}
            onPress={this._navToSignup}
            icon='loginEmail'
            iconStyle={styles.emailIcon}
            text='Sign up with Email'
            textStyle={[styles.baseTextStyle, styles.emailTextStyle]}
          />
        </View>
        <View style={styles.loginWrapper}>
          <Text style={styles.tosText}>Already have an account?&nbsp;</Text>
          <TextButton
            style={[styles.tosText, styles.loginText]}
            onPress={this._navToLogin}
            text='Log In'
          />
        </View>
        </Animated.View>
        {this.props.fetching &&
          <Loader tintColor={Colors.blackoutTint} style={styles.loader} />
        }
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hasHeroAccessToken: hasAuthData(state.session),
    fetching: state.signup.fetching,
    hasSignedUp: hasSignedUp(state.signup),
    splashShown: state.startup.splashShown,
    sessionError: state.session.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signupFacebook: (...args) => dispatch(SignupActions.signupFacebook(...args)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
