import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk'

import {Images, Metrics, Colors} from '../Themes'
import Loader from '../Components/Loader'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import TOS from '../Components/TosFooter'
import styles from './Styles/LoginScreenStyles'
import LoginActions from '../Redux/LoginRedux'
import {hasAuthData} from '../Redux/SessionRedux'

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
    attemptLogin: PropTypes.func
  }

  isAttempting = false

  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      username: '',
      password: '',
    }
    this.isAttempting = false
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
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
  }

  handlePressFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithReadPermissions([
      'public_profile',
      'email',
      'user_friends'
    ]).then(
      function(result) {
        console.log('result', result)

        if(result.loginCancelled) {
          return
        }

        AccessToken.getCurrentAccessToken().then(data => {
          console.log('data', data)
        })
      },
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
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
        blurRadius={10}
      >
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{justifyContent: 'flex-start'}}>
          <KeyboardAvoidingView behavior='position'>
            <View style={[styles.section, {marginTop: 0}]}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.instructions}>
                Welcome back!
              </Text>
            </View>

            <RoundedButton
              style={styles.facebook}
              onPress={this.handlePressFacebook}
              text={
                <Text>Login with <Text style={styles.socialTextBold}>Facebook</Text></Text>
              }
            />
            <RoundedButton
              style={styles.twitter}
              text={
                <Text>Login with <Text style={styles.socialText}>Twitter</Text></Text>
              }
            />

            <Text style={styles.instructions}>
              Or
            </Text>
              {this.props.error && <Text style={[styles.error]}>{this.props.error}</Text>}
            <View style={styles.form}>
              <Input
                ref='username'
                style={textInputStyle}
                value={username}
                editable={editable}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleChangeUsername}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password.focus()}
                placeholder='Username' />

              <Input
                ref='password'
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
              text="Login"
              onPress={this.handlePressLogin}
            />

            <TextButton
              containerStyle={styles.forgotWrapper}
              style={styles.forgot}
              text="Forgot your password?"
              onPress={NavigationActions.resetPasswordRequest}
            />

            <TOS style={styles.tos} />

            
          </KeyboardAvoidingView>
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
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
