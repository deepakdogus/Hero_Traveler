import React from 'react'
import _ from 'lodash'
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
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
import HeroAPI from '../../Services/HeroAPI'

const api = HeroAPI.create()

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

const asyncValidate = (values, dispatch) => {
  return api.signupCheck(values)
  .then(response => {
    const {data} = response
    const errors = {}
    for (key in data) {
      if (data[key]) errors[key] = `That ${key} is already taken`
    }
    if (Object.keys(errors).length) throw errors
    return {}
  })
}

class Input extends React.Component {
  render() {
    const {input, meta} = this.props
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          returnKeyType={'done'}
          onChangeText={this.props.input.onChange}
          onFocus= { val => input.onFocus(val)}
          onBlur= { val => input.onBlur(val)}
          placeholderTextColor='white'
          {...this.props}
        />
        {!meta.pristine && !meta.active && meta.error &&
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
        _.trim(this.props.fullName),
        _.trim(this.props.username),
        _.trim(this.props.email),
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
        blurRadius={20}
      >
        <ScrollView style={styles.container}>
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
                textStyle={styles.submitText}
                onPress={handleSubmit(this._signup)}
              />
              <TOS styles={[styles.section, styles.tos]} />
            </View>
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
        fullName: _.trim(selector(state, 'fullName')),
        username: _.trim(selector(state, 'username')),
        email: _.trim(selector(state, 'email')),
        password: _.trim(selector(state, 'password')),
        confirmPassword: _.trim(selector(state, 'confirmPassword')),
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
    asyncValidate: asyncValidate,
    asyncBlurFields: ['username', 'email'],
    initialValues: {
      fullName: 'Ryan W',
      username: '',
      email: '',
      password: 'ryanwood',
      confirmPassword: 'ryanwood'
    },
  })
)(SignupScreen)
