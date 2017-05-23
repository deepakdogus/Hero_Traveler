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

import {Images} from '../Themes'
import RoundedButton from '../Components/RoundedButton'
import styles from './Styles/ResetPasswordRequestScreenStyles'
import LoginActions from '../Redux/LoginRedux'


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

class ResetPasswordScreen extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    updatePassword: PropTypes.func,
    token: PropTypes.string.isRequired
  }

  static contextTypes = {
    routes: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: ''
    }
  }

  handleResetPassword = () => {
    const {token} = this.props
    const {password, confirmPassword} = this.state

    if (password !== confirmPassword) {
      alert('Passwords must match')
      return
    }
    this.props.resetPassword(
      token,
      password
    )
    this.context.routes.login()
  }

  render () {
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
            <View style={{height: 60}}>
            </View>
            <Input
              ref='password'
              style={styles.input}
              value={this.state.password}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              secureTextEntry
              autoCorrect={false}
              onChangeText={(password) => this.setState({password})}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.confirmPassword.focus()}
              placeholder='Password' />

            <Input
              ref='confirmPassword'
              style={styles.input}
              value={this.state.confirmPassword}
              keyboardType='default'
              returnKeyType='done'
              autoCapitalize='none'
              secureTextEntry
              autoCorrect={false}
              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.handleResetPassword}
              placeholder='Confirm Password' />

            <RoundedButton
              text="Submit"
              onPress={this.handleResetPassword}
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
    resetPassword: (token, password) => dispatch(LoginActions.resetPassword(token, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen)
