import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import LoginActions from '../../../Shared/Redux/LoginRedux'
import UXActions from '../../../Redux/UXRedux'

import OnClickOutsideModal from '../OnClickOutsideModal'
import RoundedButton from '../../../Shared/Web/Components/RoundedButton'
import {
  Title,
  StyledInput,
  ErrorMessage,
} from '../../Modals/Shared'

import {
  validate,
} from '../../../Shared/Lib/userFormValidation'

const RestyledInput = styled(StyledInput)`
  margin: 10px 0 50px;
`

class ResetPassword extends React.Component {
  static propTypes = {
    closeGlobalModal: PropTypes.func,
    resetPasswordRequest: PropTypes.func,
  }

  state = {
    email: '',
    error: '',
  }

  _handleEmailChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  _handleResetPasswordRequest = () => {
    const errors = validate(this.state, null, ['email'])

    if (errors.email) {
      const errorMessage = errors.email === 'Required'
      ? 'Email is required'
      : errors.email
      this.setState({error: errorMessage})
    }
    else {
      this.props.resetPasswordRequest(this.state.email)
      alert('A password reset link has been emailed to you!')
      this.props.closeGlobalModal()
    }
  }

  render() {
    return (
      <OnClickOutsideModal>
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
      </OnClickOutsideModal>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    resetPasswordRequest: email => dispatch(LoginActions.resetPasswordRequest(email)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(ResetPassword)
