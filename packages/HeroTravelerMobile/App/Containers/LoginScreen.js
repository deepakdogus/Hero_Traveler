import React, { PropTypes } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import {
  Actions as NavigationActions,
  ActionConst as NavActionConst
} from 'react-native-router-flux'

import {Images, Metrics} from '../Themes'
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
  keyboardDidShowListener = {}
  keyboardDidHideListener = {}

  constructor (props) {
    super(props)
    this.state = {
      username: 'rwoody',
      password: 'ryanwood',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isLoggedIn) {
      this.props.goToMyFeed()
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handlePressLogin = () => {
    const { username, password } = this.state
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    this.props.attemptLogin(username, password)
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
          style={[styles.container, {height: this.state.visibleHeight}]}
          contentContainerStyle={{justifyContent: 'flex-start'}}
          keyboardShouldPersistTaps='always'>

          <View style={[styles.section, {marginTop: 0}]}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.instructions}>
              Welcome back!
            </Text>
          </View>

          <RoundedButton
            style={styles.facebook}
            onPress={this.props.attemptFacebookSignup}
            text='Sign up with Facebook'
          />
          <RoundedButton
            style={styles.twitter}
            text='Sign up with Twitter'
          />

          <Text style={styles.instructions}>
            Or
          </Text>

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

          <RoundedButton
            text="Login"
            onPress={this.handlePressLogin}
          />

          <TextButton
            containerStyle={styles.forgotWrapper}
            style={styles.forgot}
            text="Forgot your password?"
            onPress={() => alert('Forgot password')}
          />

          <TOS style={styles.tos} />

          {this.props.error && <Text style={styles.error}>{this.props.error}</Text>}

        </ScrollView>
      </Image>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    error: state.login.error,
    fetching: state.login.fetching,
    isLoggedIn: hasAuthData(state.session)
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
