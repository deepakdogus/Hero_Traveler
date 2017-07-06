import React, { PropTypes } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import { Images } from '../Shared/Themes'
import RoundedButton from '../Components/RoundedButton'
import styles from './Styles/ResetPasswordRequestScreenStyles'
import LoginActions from '../Shared/Redux/LoginRedux'

const Constants = {
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

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

class ResetPasswordRequestScreen extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    updatePassword: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  handlePressResetPasswordRequest = () => {

    if (!Constants.EMAIL_REGEX.test(this.state.email)) {
      alert('Invalid email address')
      return
    }

    // TODO implement backend update.
    this.props.resetPasswordRequest(this.state.email)
    alert('A password reset link has been emailed to you!')
    NavigationActions.login()

  }

  handleChangeEmail = (text) => {
    this.setState({ email: text })
  }

  render () {
    const email = this.state.email
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
              <Text style={styles.title}>RESET PASSWORD</Text>
              <Text style={styles.instructions}>
              Please enter your email address
              </Text>
            </View>
            <View style={{height: 120}}>
            </View>
            <Input
              ref='email'
              style={styles.input}
              value={email}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeEmail}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressResetPasswordRequest}
              placeholder='Email' />

            <RoundedButton
              text="Submit"
              onPress={this.handlePressResetPasswordRequest}
            />

            {this.props.error && <Text style={styles.error}>{this.props.error}</Text>}
          </KeyboardAvoidingView>
        </ScrollView>
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
    resetPasswordRequest: (email) => dispatch(LoginActions.resetPasswordRequest(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordRequestScreen)
