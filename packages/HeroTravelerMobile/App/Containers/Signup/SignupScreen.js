import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import R from 'ramda'

import SignupActions, {hasSignedUp} from '../../Redux/SignupRedux'
import { Images, Colors } from '../../Themes'
import Loader from '../../Components/Loader'
import RoundedButton from '../../Components/RoundedButton'
import TOS from '../../Components/TosFooter'
import styles from '../Styles/SignupScreenStyles'

// These should be in ht-util
// but there appears to be a symlink bug with RN/lerna
const Constants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  USERNAME_MIN_LENGTH: 5,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{5,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const validate = (values) => {
  const errors = {}

  if (!values.fullName) {
    errors.fullName = 'Required'
  } else if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length < Constants.USERNAME_MIN_LENGTH || values.username.length > Constants.USERNAME_MAX_LENGTH) {
    errors.username = `Must be between ${Constants.USERNAME_MIN_LENGTH} and ${Constants.USERNAME_MAX_LENGTH} characters`
  } else if (!Constants.USERNAME_REGEX.test(values.username)) {
    errors.username = 'Usernames may contain letters, numbers, _ and -'
  } else if (!values.email) {
    errors.email = 'Required'
  } else if (!Constants.EMAIL_REGEX.test(values.email)) {
    errors.email = 'Invalid email address'
  } else if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < Constants.PASSWORD_MIN_LENGTH || values.password.length > Constants.PASSWORD_MAX_LENGTH) {
    errors.password = `Passwords must be ${Constants.PASSWORD_MIN_LENGTH} to ${Constants.PASSWORD_MAX_LENGTH} characters long`
  } else if (!values.confirmPassword || values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}

class Input extends React.Component {
  render() {
    const {input, meta} = this.props
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={this.props.input.onChange}
          placeholderTextColor='white'
          {...this.props}
        />
        {meta.touched && meta.error &&
          <View style={styles.errorView}>
            <Text style={styles.error}>{meta.error}</Text>
          </View>
        }
      </View>
    )
  }
}

class SignupScreen extends React.Component {

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && newProps.hasSignedUp) {
      NavigationActions.signupFlow()
    }
  }

  _signup = () => {
    if (!this.props.fetching) {
      this.props.attemptSignup(
        this.props.fullName,
        this.props.username,
        this.props.email,
        this.props.password
      )
    }
  }

  // this.props.fetching
  render () {
    const {handleSubmit} = this.props

    return (
      <Image
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={10}
      >
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <View style={styles.section}>
              <Text style={styles.title}>SIGN UP</Text>
              <Text style={styles.instructions}>
                Let's start by setting up your account
              </Text>
              {this.props.signupError && <Text style={[styles.error]}>{this.props.signupError}</Text>}
            </View>
            <View style={styles.form}>
              <Field
                name='fullName'
                component={Input}
                placeholder='Full name'
              />
              <Field
                name='username'
                autoCapitalize='none'
                component={Input}
                placeholder='Username'
              />
              <Field
                name='email'
                autoCapitalize='none'
                component={Input}
                placeholder='Email'
                keyboardType='email-address'
              />
              <Field
                name='password'
                autoCapitalize='none'
                component={Input}
                placeholder='Password'
                secureTextEntry={true}
              />
              <Field
                name='confirmPassword'
                autoCapitalize='none'
                component={Input}
                placeholder='Confirm password'
                secureTextEntry={true}
              />
              <RoundedButton
                text='Sign Up'
                capitalize={true}
                style={styles.submitButton}
                onPress={handleSubmit(this._signup)}
              />
              

              <TOS styles={[styles.section, styles.tos]} />
            </View>
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


const selector = formValueSelector('signupForm')
export default R.compose(
  connect(
    (state) => {
      return {
        fetching: state.signup.fetching,
        hasSignedUp: hasSignedUp(state.signup),
        signupError: state.signup.error,
        fullName: selector(state, 'fullName'),
        username: selector(state, 'username'),
        email: selector(state, 'email'),
        password: selector(state, 'password'),
        confirmPassword: selector(state, 'confirmPassword'),
      }
    },
    (dispatch) => {
      return {
        attemptSignup: (fullName, username, email, password) => {
          return dispatch(SignupActions.signupEmail(fullName, username, email, password))
        }
      }
    }
  ),
  reduxForm({
    form: 'signupForm',
    destroyOnUnmount: true,
    validate,
    initialValues: {
      fullName: 'Ryan W',
      username: 'rwoody',
      email: 'rwoody@gmail.com',
      password: 'ryanwood',
      confirmPassword: 'ryanwood'
    }
  })
)(SignupScreen)
