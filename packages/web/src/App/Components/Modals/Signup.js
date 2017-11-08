/* eslint no-useless-escape: 0 */

import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import R from 'ramda'

import SignupActions, {hasSignedUp} from '../../Shared/Redux/SignupRedux'
import HeroAPI from '../../Shared/Services/HeroAPI'

import RoundedButton from '../RoundedButton'
import FormInput from '../FormInput'
import SocialMediaButton from './Shared/SocialMediaButton'
import {
  Container,
  Title,
  Text,
  HasAccount,
  SignupText,
} from './Shared'

const SmallBold = styled.strong`
  font-weight: 600;
`

const ToSText = styled(Text)`
  font-size: 12px;
  margin-bottom: 39px;
`

const api = HeroAPI.create()

// These should be in ht-util
// but there appears to be a symlink bug with RN/lerna
const Constants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{1,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
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
    Object.keys(data).forEach(key => {
      if (data[key]) errors[key] = `That ${key} is already taken`

    })
    if (Object.keys(errors).length) throw errors
    return {}
  })
}

class Signup extends React.Component {
  static PropTypes = {
    onLoginClick: PropTypes.func,
    onAttemptSignup: PropTypes.func,
    fetching: PropTypes.bool,
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }

  _onTextChange = (event) => {
    this.setState({
      [event.target.name]: _.trim(event.target.value)
    })
  }

  _onAttemptSignup = () => {
    if (!this.props.fetching) {
      this.props.onAttemptSignup(
        _.trim(this.props.fullName),
        _.trim(this.props.username),
        _.trim(this.props.email),
        _.trim(this.props.password)
      )
    }
  }

  render() {
    return (
      <Container>
        <Title>SIGN UP</Title>
        <SocialMediaButton
          type='facebookSignup'
          iconName='facebookLarge'
          page='signup'
        />
        <SocialMediaButton
          type='twitterSignup'
          iconName='twitterLarge'
          page='signup'
        />
        <Text>Or</Text>
        <Field
          name='fullName'
          component={FormInput}
          type='text'
          placeholder='Full Name'
        />
        <Field
          name='username'
          component={FormInput}
          type='text'
          placeholder='Username'
        />
        <Field
          name='email'
          component={FormInput}
          type='text'
          placeholder='Email'
        />
        <Field
          name='password'
          component={FormInput}
          type='password'
          placeholder='Password'
        />
        <Field
          name='confirmPassword'
          component={FormInput}
          type='password'
          placeholder='Confirm Password'
        />
        <ToSText>By continuing, you accept the <SmallBold>Terms of Use</SmallBold> and <SmallBold>Privacy Policy</SmallBold></ToSText>
        <RoundedButton
          text='SIGN UP'
          width='100%'
          margin='none'
          height='39px'
          onClick={this._onAttemptSignup}
        />

        <HasAccount>Already have an account?
          <SignupText onClick={this.props.onLoginClick}> Login</SignupText>
        </HasAccount>
      </Container>
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
        onAttemptSignup: (fullName, username, email, password) => {
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
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  })
)(Signup)
