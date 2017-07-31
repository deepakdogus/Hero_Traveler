import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import RoundedButton from '../RoundedButton'
import SocialMediaButton from './SocialMediaButton'
import {
  Container,
  Title,
  StyledText,
  HasAccount,
  SignupText,
  StyledInput,
} from './Shared'

const ForgotPasswordText = styled(StyledText)`
  font-size: 14px;
  margin-bottom: 39px;
`

export default class Login extends React.Component {
  static PropTypes = {
    onSignupClick: PropTypes.func,
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
        <StyledText>Or</StyledText>
        <StyledInput placeholder='Username'/>
        <StyledInput placeholder='Password' type='password'/>
        <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
        <RoundedButton
          text='LOGIN'
          width='100%'
          margin='none'
          height='39px'
        />

        <HasAccount>Don't have an account? <SignupText onClick={onSignupClick}>Sign up</SignupText></HasAccount>
      </Container>
    )
  }
}
