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

const SmallBold = styled.strong`
  font-weight: 600;
`

const ToSText = styled(Text)`
  font-size: 12px;
  margin-bottom: 39px;
`

export default class Signup extends React.Component {
  static PropTypes = {
    onLoginClick: PropTypes.func,
  }

  render() {
    const {onLoginClick} = this.props
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
        <StyledInput placeholder='Full Name'/>
        <StyledInput placeholder='Username'/>
        <StyledInput placeholder='Email'/>
        <StyledInput placeholder='Password' type='password'/>
        <StyledInput placeholder='Confirm Password' type='password'/>
        <ToSText>By continuing, you accept the <SmallBold>Terms of Use</SmallBold> and <SmallBold>Privacy Policy</SmallBold></ToSText>
        <RoundedButton
          text='SIGN UP'
          width='100%'
          margin='none'
          height='39px'
        />

        <HasAccount>Already have an account? <SignupText onClick={onLoginClick}>Login</SignupText></HasAccount>
      </Container>
    )
  }
}
