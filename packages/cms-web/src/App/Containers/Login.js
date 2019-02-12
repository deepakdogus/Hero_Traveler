import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginActions from '../Shared/Redux/LoginRedux'

import RoundedButton from '../Components/RoundedButton'

import {
  Title,
  Text,
  StyledInput,
} from '../Components/Login'

const LoginWrapper = styled.div`
  width: 420px;
  margin: 100px auto;
`

const WhiteText = styled.div`
  color: white;
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

  render() {
    let {
      loginReduxFetching,
      loginReduxError,
    } = this.props

    if (loginReduxError === 'Unauthorized' || loginReduxError === 'CLIENT_ERROR') {
      loginReduxError = 'Invalid username or password'
    }
    else if (loginReduxError === 'TIMEOUT_ERROR' ||
      loginReduxError === 'NETWORK_ERROR' ) {
      loginReduxError = 'Unable to login, check your connection...'
    }

    return (
      <LoginWrapper>
        <Title>Login</Title>
          <form onSubmit={this.onAttemptLogin}>
            <StyledInput
              placeholder='Username OR Email'
              onChange={this.setUserIdentifier}
            />
            <StyledInput
              placeholder='Password'
              onChange={this.setPassword}
              type='password'
            />
            {loginReduxFetching &&
              <LoginFetchingText>Signing In ...</LoginFetchingText>
            }
            {(loginReduxError && !loginReduxFetching) &&
              <LoginErrorText>{loginReduxError}</LoginErrorText>
            }
            {this.state.localError &&
              <LoginErrorText>{this.state.localError}</LoginErrorText>
            }
            <RoundedButton
              width='100%'
              margin='none'
              height='39px'
              type='submit'
            >
              <WhiteText>LOGIN</WhiteText>
            </RoundedButton>
          </form>
      </LoginWrapper>
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
      dispatch(LoginActions.loginAdminRequest(userIdentifier, password)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Login)
