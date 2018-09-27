import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RoundedButton from '../../RoundedButton'
import { Row } from '../../FlexboxGrid'
import {
  Container,
  Title,
  StyledInput,
  Text,
} from '../../Modals/Shared'

const PasswordErrorText = styled(Text)`
  font-size: 14px;
  margin: 5px 0px;
  color: ${props => props.theme.Colors.errorRed};
`

export const Constants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
}


export default class ResetPasswordAttempt extends React.Component {
  static propTypes = {
    resetPasswordAttempt: PropTypes.func,
    params: PropTypes.object,
  }
  state = {
    newPassword: '',
    confirmPassword: '',
    passwordError: ''
  }

  _handleChange = (e) =>{
    e.preventDefault()
    this.setState({
    [e.target.name]: e.target.value
    })
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    const { newPassword, confirmPassword } = this.state
    let passwordError = ''
    if (!newPassword || !confirmPassword) {
        passwordError ='Both Fields Must Be Filled Out'
    } else if (newPassword.length < Constants.PASSWORD_MIN_LENGTH || newPassword.length > Constants.PASSWORD_MAX_LENGTH) {
        passwordError = `Passwords must be ${Constants.PASSWORD_MIN_LENGTH} to ${Constants.PASSWORD_MAX_LENGTH} characters long`
    } else if (newPassword !== confirmPassword) {
      passwordError = 'Passwords do not match'
    }
    this.setState({passwordError})
    if (!passwordError) {
      this.props.resetPasswordAttempt(
        this.props.params.userToken,
        this.state.newPassword,
      )
    }
  }

  render() {
    console.log('this.props.params', this.props.params)

    return (
      <Container>
        <Title>Reset Password</Title>
        <form onSubmit={this._handleSubmit}>
          <StyledInput
            name='newPassword'
            placeholder='New Password'
            type='password'
            value={this.state.newPassword}
            onChange={this._handleChange}
          />
          <StyledInput
            name='confirmPassword'
            placeholder='Confirm Password'
            type='password'
            value={this.state.confirmPassword}
            onChange={this._handleChange}
          />
          {this.state.passwordError &&
            <PasswordErrorText>{this.state.passwordError}</PasswordErrorText>
          }
          <Row center='xs'>
            <RoundedButton
              text='Submit'
              width='100%'
              margin='none'
              height='39px'
              type='submit'
            />
          </Row>
        </form>
      </Container>
    )
  }

}