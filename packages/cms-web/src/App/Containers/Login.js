import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginActions from '../Shared/Redux/LoginRedux'

import RoundedButton from '../Shared/Web/Components/RoundedButton'

const basicTextStyle = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .2px;
`

export const Text = styled.p`
  ${basicTextStyle};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  text-align: center;
  letter-spacing: 0.2px;
`

export const StyledInput = styled.input`
  ${basicTextStyle};
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-bottom: 5px;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.Colors.dividerGrey};
  margin-bottom: 25px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  letter-spacing: 0.2px;
`

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.6px;
  text-align: center;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  padding: 30px 0;
  margin: 0;
`

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
    else if (loginReduxError === 'TIMEOUT_ERROR'
      || loginReduxError === 'NETWORK_ERROR' ) {
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
            {loginReduxFetching
              && <LoginFetchingText>Signing In ...</LoginFetchingText>
            }
            {(loginReduxError && !loginReduxFetching)
              && <LoginErrorText>{loginReduxError}</LoginErrorText>
            }
            {this.state.localError
              && <LoginErrorText>{this.state.localError}</LoginErrorText>
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
      dispatch(LoginActions.loginRequest(userIdentifier, password)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Login)
