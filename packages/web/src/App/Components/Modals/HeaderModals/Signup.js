import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import R from 'ramda'

import UXActions from '../../../Redux/UXRedux'
import SignupActions, {hasSignedUp} from '../../../Shared/Redux/SignupRedux'

import RoundedButton from '../../RoundedButton'
import FormInput from '../../FormInput'
import SocialMediaButton from '../Shared/SocialMediaButton'
import {
  Container,
  Title,
  Text,
  HasAccount,
  SignupText,
} from '../Shared'
import {
  validate,
  asyncValidate,
} from '../../../Shared/Lib/userFormValidation'

const SmallBold = styled.strong`
  font-weight: 600;
`

const ToSText = styled(Text)`
  font-size: 12px;
  margin-bottom: 39px;
`
const SignupErrorText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: ${props => props.theme.Colors.errorRed};
`
const SignupFetchingText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: ${props => props.theme.Colors.signupGrey};
`

class Signup extends React.Component {
  static propTypes = {
    openGlobalModal: PropTypes.func,
    onAttemptSignup: PropTypes.func,
    fetching: PropTypes.bool,
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    signupReduxFetching: PropTypes.bool,
    signupReduxError: PropTypes.string,
  }

  _onTextChange = (event) => {
    this.setState({
      [event.target.name]: _.trim(event.target.value),
    })
  }

  _onAttemptSignup = (e) => {
    e.preventDefault()
    if (!this.props.fetching) {
      this.props.onAttemptSignup(
        _.trim(this.props.fullName),
        _.trim(this.props.username),
        _.trim(this.props.email),
        _.trim(this.props.password),
      )
    }
  }

  openLogin = () => {
    this.props.openGlobalModal('login')
  }

  render() {
    let {
      signupReduxFetching,
      signupReduxError,
    } = this.props

    if (signupReduxError === 'NETWORK_ERROR') {
      signupReduxError = 'Unable to signup, check your connection...'
    }

    return (
      <Container>
        <Title>SIGN UP</Title>
        <form onSubmit={this._onAttemptSignup}>
          <SocialMediaButton
            type='facebookSignup'
            iconName='facebookLarge'
            page='signup'
          />
          <Text>Or</Text>
          <Field
            name='fullName'
            component={FormInput}
            type='text'
            placeholder='Full Name (eg. John Smith)'
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
          {signupReduxFetching &&
              <SignupFetchingText>Signing In ...</SignupFetchingText>
            }
          {(signupReduxError && !signupReduxFetching) &&
            <SignupErrorText>{signupReduxError}</SignupErrorText>
          }
          <ToSText>By continuing, you accept the <SmallBold>Terms of Use</SmallBold> and <SmallBold>Privacy Policy</SmallBold></ToSText>
          <RoundedButton
            text='SIGN UP'
            width='100%'
            margin='none'
            height='39px'
            type='submit'
          />
        </form>
        <HasAccount>Already have an account?
          <SignupText onClick={this.openLogin}> Login</SignupText>
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
        signupReduxFetching: state.signup.fetching,
        signupReduxError: state.signup.error,
      }
    },
    (dispatch) => {
      return {
        onAttemptSignup: (fullName, username, email, password) => {
          return dispatch(SignupActions.signupEmail(fullName, username, email, password))
        },
        openGlobalModal: (modalName, params) => {
          return dispatch(UXActions.openGlobalModal(modalName, params))
        },
      }
    },
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
      confirmPassword: '',
    },
  }),
)(Signup)
