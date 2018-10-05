import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import RoundedButton from '../../RoundedButton'
import onClickOutside from 'react-onclickoutside'
import {
  Container,
  Title,
  StyledInput,
  ErrorMessage,
} from '../../Modals/Shared'

const Constants = {
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const RestyledInput = styled(StyledInput)`
  margin: 40px 0 50px;
`

class ResetPassword extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    resetPasswordRequest: PropTypes.func,
  }

  state = {
    email: '',
    error: '',
  }

  handleClickOutside = (e) => {
    e.preventDefault()
    this.props.closeModal()
  }

  _handleEmailChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  _handleResetPasswordRequest = () => {
    if (Constants.EMAIL_REGEX.test(this.state.email)) {
      this.props.resetPasswordRequest(this.state.email)
      alert('A password reset link has been emailed to you!')
      this.props.closeModal()
    } else {
      this.setState({error: 'Invalid email address'})
    }

  }

  render() {

    return (
      <Container>
        <Title>RESET PASSWORD</Title>
        {this.state.error &&
          <ErrorMessage>{this.state.error}</ErrorMessage>
        }
        <RestyledInput
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={this._handleEmailChange}
        />
        <RoundedButton
          text='SUBMIT'
          width='100%'
          margin='none'
          height='39px'
          onClick={this._handleResetPasswordRequest}
        />
      </Container>
    )
  }
}

export default onClickOutside(ResetPassword)
