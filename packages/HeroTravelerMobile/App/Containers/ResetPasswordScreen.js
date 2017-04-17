import React, { PropTypes } from 'react'
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

import {Images, Metrics, Colors} from '../Themes'
import Loader from '../Components/Loader'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import TOS from '../Components/TosFooter'
import styles from './Styles/ResetPasswordScreenStyles'

// import ResetPasswordActions from '../Redux/LoginRedux'
// import {hasAuthData} from '../Redux/SessionRedux'

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
    updatePassword: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmPassword: '',
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isLoggedIn) {
      this.props.goToMyFeed()
    }
  }

  handlePressResetPassword = () => {
    const { newPassword, confirmPassword } = this.state

    if (newPassword.length < 4 || newPassword.length > 60) {
      alert('Please limit password length to 4-60 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match - please re-enter')
      return
    }    

    // TODO implement backend update.
    // this.props.updatePassword(newPassword)
    alert('Your password has been reset!')
    NavigationActions.login()

  }

  handleChangeNewPassword = (text) => {
    this.setState({ newPassword: text })
  }

  handleChangeConfirmPassword = (text) => {
    this.setState({ confirmPassword: text })
  }

  render () {
    const { newPassword, confirmPassword } = this.state
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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.instructions}>
              Please enter a new password between 4-60 characters
              </Text>
            </View>
            <View style={{height: 100}}>
            </View>
            <Input
              ref='newPassword'
              style={styles.input}
              value={newPassword}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangeNewPassword}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.password.focus()}
              placeholder='New password' />

            <Input
              ref='confirmPassword'
              style={styles.input}
              value={confirmPassword}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              onChangeText={this.handleChangeConfirmPassword}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressLogin}
              placeholder='Confirm new password' />

            <RoundedButton
              text="Submit"
              onPress={this.handlePressResetPassword}
            />

            <TOS style={styles.tos} />

            {this.props.error && <Text style={styles.error}>{this.props.error}</Text>}
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePassword: (newPassword) => {
      // return dispatch(SignupActions.signupEmail(fullName, username, email, password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
