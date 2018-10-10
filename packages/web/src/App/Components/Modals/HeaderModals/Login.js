import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import RoundedButton from '../../RoundedButton'
import SocialMediaButton from '../../Modals/Shared/SocialMediaButton'
import Colors from '../../../Shared/Themes/Colors'
import onClickOutside from 'react-onclickoutside'
import {
  Container,
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
  color: ${Colors.errorRed}
`
const LoginFetchingText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: ${Colors.signupGrey}
`

class Login extends React.Component {
  static propTypes = {
    onAttemptLogin: PropTypes.func,
    onSignupClick: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.string,
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

  handleClickOutside = (e) => {
    e.preventDefault()
    this.props.closeGlobalModal()
  }

  _onAttemptLogin = (e) => {
    e.preventDefault()
    const {onAttemptLogin} = this.props
    const {password, userIdentifier} = this.state
    if(!password || !userIdentifier){
      this.setState({
        localError: 'Please input both username and password'
      })
    } else {
      onAttemptLogin(userIdentifier, password)
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

  render() {
    let {
      onSignupClick,
      loginReduxFetching,
      loginReduxError,
      loginFacebook
    } = this.props

    if (loginReduxError === 'Unauthorized' || loginReduxError === 'CLIENT_ERROR') {
      loginReduxError = "Invalid username or password"
    } else if (loginReduxError === 'TIMEOUT_ERROR' || loginReduxError === 'NETWORK_ERROR' ) {
      loginReduxError = "Unable to login, check your connection..."
    }

    return (
      <Container>
        <Title>Login</Title>
        <SocialMediaButton
          type='facebookSignup'
          iconName='facebookLarge'
          page='login'
          onClick={loginFacebook}
        />
        <Text>Or</Text>
          <form onSubmit={this._onAttemptLogin}>
            <StyledInput placeholder='Username OR Email' onChange={this.setUserIdentifier}/>
            <StyledInput placeholder='Password' onChange={this.setPassword} type='password'/>
            {loginReduxFetching &&
              <LoginFetchingText>Signing In ...</LoginFetchingText>
            }
            {(loginReduxError && !loginReduxFetching) &&
              <LoginErrorText>{loginReduxError}</LoginErrorText>
            }
            {this.state.localError &&
              <LoginErrorText>{this.state.localError}</LoginErrorText>
            }
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
        <HasAccount>Don't have an account? <SignupText onClick={onSignupClick}>Sign up</SignupText></HasAccount>
      </Container>
    )
  }
}

export default onClickOutside(Login)
