import React from 'react'
import { Text, Image, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'

import {hasAuthData} from '../Redux/SessionRedux'
import SignupActions, {hasSignedUp} from '../Redux/SignupRedux'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import { Images } from '../Themes'
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      facebookLoggedIn: false
    }
  }

  async componentDidMount() {
    const fbAccessToken = await AccessToken.getCurrentAccessToken()

    // are we logged in to facebook?
    if (fbAccessToken) {
      // do something here
    }

    console.log('tokenInfo', fbAccessToken)

    // dev only
    this.setState({
      facebookLoggedIn: fbAccessToken
    })

    // @TODO check for email credentials and forward user

    SplashScreen.hide()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && newProps.hasSignedUp) {
      NavigationActions.signupFlow()
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
        AccessToken.getCurrentAccessToken().then(data => {
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

  render () {
    return (
      <Image
        source={Images.launchBackground}
        style={[styles.backgroundImage]}
      >
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
            onPress={() => {
              LoginManager.logOut()
              this.setState({
                facebookLoggedIn: false
              })
            }}
            text='Logout of facebook'
          />}
          <RoundedButton
            style={styles.facebook}
            onPress={this._signupFacebook}
            text='Sign up with Facebook'
          />
          <RoundedButton
            style={styles.twitter}
            text='Sign up with Twitter'
          />
          <RoundedButton
            style={styles.email}
            onPress={NavigationActions.signup}
            text='Sign up with Email'
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
      </Image>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: hasAuthData(state.session),
    fetching: state.signup.fetching,
    hasSignedUp: hasSignedUp(state.signup),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signupFacebook: (...args) => dispatch(SignupActions.signupFacebook(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
