import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import RoundedButton from '../../RoundedButton'
import SocialMediaButton from '../../Modals/Shared/SocialMediaButton'

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
`

export default class Login extends React.Component {
  static propTypes = {
    onAttemptLogin: PropTypes.func,
    onSignupClick: PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  _onAttemptLogin = (e) => {
    e.preventDefault()
    const {onAttemptLogin} = this.props
    const {password, username} = this.state
    onAttemptLogin(username, password)
  }

  setUsername = (event) => {
    this.setState({username: event.target.value})
  }

  setPassword =(event) => {
    this.setState({password: event.target.value})
  }

  render() {
    const {onSignupClick} = this.props
    return (
      <Container>
        <Title>Login</Title>
        <SocialMediaButton
          type='facebookSignup'
          iconName='facebookLarge'
          page='login'
        />
        <SocialMediaButton
          type='twitterSignup'
          iconName='twitterLarge'
          page='login'
        />
        <Text>Or</Text>
          <form onSubmit={this._onAttemptLogin}>
            <StyledInput placeholder='Username' onChange={this.setUsername}/>
            <StyledInput placeholder='Password' onChange={this.setPassword} type='password'/>
            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
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
