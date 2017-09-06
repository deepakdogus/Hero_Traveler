import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'
import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk'

import {Images, Colors} from '../Shared/Themes'
import Loader from '../Components/Loader'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import styles from './Styles/LoginScreenStyles'
// pulling launchStyles so that buttons are styled the same as launchScreen
import launchStyles from './Styles/LaunchScreenStyles'
import LoginActions from '../Shared/Redux/LoginRedux'
import SignupActions from '../Shared/Redux/SignupRedux'

class Input extends React.Component {
  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          {...this.props}
        />
      </View>
    )
  }
}

class LoginScreen extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    fetching: PropTypes.bool,
    attemptLogin: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    error: PropTypes.string,
    goToMyFeed: PropTypes.func,
    signupFacebook: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      username: '',
      password: '',
    }
  }

  componentWillReceiveProps (newProps) {
    if (!this.props.isLoggedIn && newProps.isLoggedIn) {
      this.props.goToMyFeed()
    }
  }

  handlePressLogin = () => {

    // TODO fix Ghetto check
    const conditions = _.every([
      this.state.username,
      this.state.password,
    ])

    this.setState({
      username: _.trim(this.state.username),
      password: _.trim(this.state.password),
    })

    if (!conditions) {
      alert('Please complete all fields')
      return
    }

    const { username, password } = this.state
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
  }

  loginFinishedManager = (/*err, result*/) => {
    LoginManager.logInWithReadPermissions([
      'public_profile',
      'email',
      'user_friends'
    ]).then(result => {
      if(!result.isCancelled) {
        AccessToken.getCurrentAccessToken().then((/*data*/) => {
            this.getUserInfoAndSignup()
          }
        )
      }
    })
    .catch(err => console.log('fb login error:', err))

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

  handleChangeUsername = (text) => {
    this.setState({ username: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  render () {
    const { username, password } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? styles.input : styles.textInputReadonly
    return (
      <Image
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={25}
      >
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{justifyContent: 'flex-start'}}>
          <View style={[styles.section, {marginTop: 0}]}>
            <Text style={styles.title}>LOG IN</Text>
            <Text style={styles.instructions}>
              Welcome back!
            </Text>
          </View>
          <RoundedButton
            style={launchStyles.facebook}
            onPress={this.loginFinishedManager}
            icon='facebook'
            iconStyle={launchStyles.facebookIcon}
            text='Log in with Facebook'
            textStyle={[launchStyles.baseTextStyle, launchStyles.facebookTextStyle]}
          />
          {/*<RoundedButton
            style={styles.twitter}
            text={
              <Text>Login with <Text style={styles.socialText}>Twitter</Text></Text>
            }
          />*/}

          <Text style={styles.instructions}>
            Or
          </Text>

          {this.props.error && <Text style={[styles.error]}>{this.props.error}</Text>}

          <View style={styles.form}>
            <Input
              style={textInputStyle}
              value={username}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeUsername}
              underlineColorAndroid='transparent'
              placeholder='Username' />

            <Input
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangePassword}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressLogin}
              placeholder='Password' />
          </View>
          <RoundedButton
            style={[launchStyles.email, styles.loginButton]}
            onPress={this.handlePressLogin}
            text='LOG IN'
            textStyle={launchStyles.baseTextStyle}
          />
          <TextButton
            containerStyle={styles.forgotWrapper}
            style={styles.forgot}
            text="Forgot your password?"
            onPress={NavigationActions.resetPasswordRequest}
          />
        </ScrollView>
        {this.props.fetching &&
          <Loader
            style={styles.spinner}
            tintColor={Colors.blackoutTint}
            spinnerColor={Colors.snow}
          />
        }
      </Image>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    error: state.login.error,
    fetching: state.login.fetching,
    isLoggedIn: state.login.isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMyFeed: () => {
      return NavigationActions.tabbar({type: NavActionConst.POP_AND_REPLACE})
    },
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    signupFacebook: (...args) => dispatch(SignupActions.signupFacebook(...args)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
