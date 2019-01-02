import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginActions from '../../../Shared/Redux/LoginRedux'
import SignupActions from '../../../Shared/Redux/SignupRedux'
import UXActions from '../../../Redux/UXRedux'

import OnClickOutsideModal from '../OnClickOutsideModal'
import RoundedButton from '../../RoundedButton'
import SocialMediaButton from '../Shared/SocialMediaButton'
import {
  Title,
  Text,
  HasAccount,
  SignupText,
  StyledInput,
} from '../../Modals/Shared'

const ForgotPasswordText = styled(Text)`
  font-size: 14px;
  margin-bottom: 39px;
  cursor: pointer;
`

const LoginErrorText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: ${props => props.theme.Colors.errorRed};
`

const LoginFetchingText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: ${props => props.theme.Colors.signupGrey};
`

class Login extends Component {
  static propTypes = {
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.string,
    attemptLogin: PropTypes.func,
    loginFacebook: PropTypes.func,
    openGlobalModal: PropTypes.func,
    closeGlobalModal: PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      userIdentifier: '',
      password: '',
      localError: '',
    }
  }

  onAttemptLogin = (e) => {
    e.preventDefault()
    const {attemptLogin} = this.props
    const {password, userIdentifier} = this.state
    if(!password || !userIdentifier){
      this.setState({
        localError: 'Please input both username and password',
      })
    }
    else {
      attemptLogin(userIdentifier, password)
      if(this.state.localError) {
        this.setState({localError: ''})
      }
    }
  }

  setUserIdentifier = (event) => {
    this.setState({userIdentifier: event.target.value})
  }

  setPassword =(event) => {
    this.setState({password: event.target.value})
  }

  _openResetPasswordModal = () => {
    this.props.openGlobalModal('resetPasswordRequest')
  }

  openSignup = () => {
    this.props.openGlobalModal('signup')
  }

  render() {
    let {
      loginReduxFetching,
      loginReduxError,
      loginFacebook,
    } = this.props

    if (loginReduxError === 'Unauthorized' || loginReduxError === 'CLIENT_ERROR') {
      loginReduxError = 'Invalid username or password'
    }
    else if (loginReduxError === 'TIMEOUT_ERROR' || loginReduxError === 'NETWORK_ERROR' ) {
      loginReduxError = 'Unable to login, check your connection...'
    }

    return (
      <OnClickOutsideModal>
        <Title>Login</Title>
        <SocialMediaButton
          type='facebookSignup'
          iconName='facebookLarge'
          page='login'
          onClick={loginFacebook}
        />
        <Text>Or</Text>
          <form onSubmit={this.onAttemptLogin}>
            <StyledInput placeholder='Username OR Email' onChange={this.setUserIdentifier}/>
            <StyledInput placeholder='Password' onChange={this.setPassword} type='password'/>
            {loginReduxFetching && (
              <LoginFetchingText>Signing In ...</LoginFetchingText>
            )}
            {(loginReduxError && !loginReduxFetching) && (
              <LoginErrorText>{loginReduxError}</LoginErrorText>
            )}
            {this.state.localError && (
              <LoginErrorText>{this.state.localError}</LoginErrorText>
            )}
              <ForgotPasswordText
                onClick={this._openResetPasswordModal}
              >
                Forgot Password?
              </ForgotPasswordText>
            <RoundedButton
              text='LOGIN'
              width='100%'
              margin='none'
              height='39px'
              type='submit'
            />
          </form>
        <HasAccount>Don’t have an account?
          <SignupText onClick={this.openSignup}>
            &nbsp;Sign up
          </SignupText>
        </HasAccount>
      </OnClickOutsideModal>
    )
  }
}

function mapStateToProps(state) {
  return {
    loginReduxFetching: state.login.fetching,
    loginReduxError: state.login.error,
  }
}

function mapDispatchtoProps(dispatch) {
  return {
    attemptLogin: (userIdentifier, password) =>
      dispatch(LoginActions.loginRequest(userIdentifier, password)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    loginFacebook: () => dispatch(SignupActions.signupFacebook()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Login)
