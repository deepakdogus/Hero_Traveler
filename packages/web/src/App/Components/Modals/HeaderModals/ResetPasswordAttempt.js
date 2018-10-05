import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import LoginActions from '../../../Shared/Redux/LoginRedux'
import UXActions from '../../../Redux/UXRedux'
import RoundedButton from '../../RoundedButton'
import { Row } from '../../FlexboxGrid'
import {
  Container,
  Title,
  StyledInput,
  ErrorMessage,
} from '../../Modals/Shared'
import {
  FieldConstraints,
} from '../../../Shared/Lib/userFormValidation'

class ResetPasswordAttempt extends React.Component {
  static propTypes = {
    resetPasswordAttempt: PropTypes.func,
    resetToken: PropTypes.string,
    path: PropTypes.string,
    fetching: PropTypes.bool,
    error: PropTypes.string,
    openGlobalModal: PropTypes.func,
    reroute: PropTypes.func,
  }

  state = {
    newPassword: '',
    confirmPassword: '',
    passwordError: ''
  }

  componentDidUpdate = (prevProps) => {
    const {
      fetching,
      error,
      reroute,
      openGlobalModal,
      path,
    } = this.props
    if (prevProps.fetching && !fetching && !error) {
      reroute(path)
      openGlobalModal('login')
    }
  }

  _handleChange = (e) => {
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
    } else if (newPassword.length < FieldConstraints.PASSWORD_MIN_LENGTH || newPassword.length > FieldConstraints.PASSWORD_MAX_LENGTH) {
        passwordError = `Passwords must be ${FieldConstraints.PASSWORD_MIN_LENGTH} to ${FieldConstraints.PASSWORD_MAX_LENGTH} characters long`
    } else if (newPassword !== confirmPassword) {
      passwordError = 'Passwords do not match'
    }
    this.setState({passwordError})
    if (!passwordError) {
      this.props.resetPasswordAttempt(
        this.props.resetToken,
        this.state.newPassword,
      )
    }
  }

  render() {
    const errorText = this.state.passwordError || this.props.error

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
          {errorText &&
            <ErrorMessage>{errorText}</ErrorMessage>
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

function mapStateToProps(state) {
  return {
    path: state.ux.params.path,
    resetToken: state.ux.params.token,
    fetching: state.login.fetching,
    error: state.login.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    reroute: (path) => dispatch(push(path)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
    resetPasswordAttempt: (password, token) => dispatch(LoginActions.resetPassword(password, token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordAttempt)
