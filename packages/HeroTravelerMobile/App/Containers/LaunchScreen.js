import React from 'react'
import { Text, Image, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'

import SessionActions, {hasAuthData} from '../Shared/Redux/SessionRedux'
import SignupActions, {hasSignedUp} from '../Shared/Redux/SignupRedux'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import { Images } from '../Shared/Themes'
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      facebookLoggedIn: false,
      animationValue: new Animated.Value(0)
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && newProps.hasSignedUp) {
      NavigationActions.signupFlow()
    }

    if (this.props.splashShown && !newProps.splashShown && !this.props.hasHeroAccessToken) {
      SplashScreen.hide()
      this.fadeIn()
    }
  }

  _signupFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithReadPermissions([
      'public_profile',
      'email',
      'user_friends'
    ]).then(
      (result) => {
        AccessToken.getCurrentAccessToken().then(token => {
          if(result.isCancelled) {
            return
          }

          this.getUserInfoAndSignup()
        })
      },
      (error) => {
        console.log('Login fail with error: ' + error);
      }
    )
  }

  _handleGraphQuery = (error, data) => {
    if (error) {
      console.log('Error fetching data', error);
      return
    }

    const userPicture = !data.picture.data.is_silhouette ?
      data.picture.data.url : null

    this.props.signupFacebook(
      data.id,
      data.email,
      data.name,
      userPicture
    )
  }

  getUserInfoAndSignup = () => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email,about,name,picture.type(large)'
          }
        }
      },
      this._handleGraphQuery,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  fadeIn() {
    Animated.timing(
      this.state.animationValue,
      {
        toValue: 1,
        duration: 1500
      }
    ).start()
  }

  _logoutFb = () => {
    LoginManager.logOut()
    this.setState({
      facebookLoggedIn: false
    })
  }

  render () {
    return (
      <Image
        source={Images.launchBackground}
        style={[styles.backgroundImage]}
      >
        <Animated.View style={{flex: 1, opacity: this.state.animationValue}}>
        <View style={[styles.logoSection]}>
          <Image source={Images.whiteLogo} style={styles.logo} />
          <Text
            style={styles.tagline}
            textAlign='center'
          >{'Share Your Adventures with the World'}</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.signupButtons}>

          {false && <RoundedButton
            style={styles.facebook}
            onPress={this.getUserInfoAndSignup}
            text='Make Graph Query'
          />}

          {this.state.facebookLoggedIn && false && <RoundedButton
            style={styles.facebook}
            onPress={this._logoutFb}
            text='Logout of facebook'
          />}
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
            onPress={NavigationActions.signup}
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
            onPress={NavigationActions.login}
            text='Log In'
          />
        </View>
        </Animated.View>
      </Image>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hasHeroAccessToken: hasAuthData(state.session),
    fetching: state.signup.fetching,
    hasSignedUp: hasSignedUp(state.signup),
    splashShown: state.startup.splashShown,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resumeSession: () => dispatch(SessionActions.resumeSession()),
    signupFacebook: (...args) => dispatch(SignupActions.signupFacebook(...args)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
