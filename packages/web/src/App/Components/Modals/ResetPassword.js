/* eslint no-useless-escape: 0 */

import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import R from 'ramda'

import LoginActions from '../../Shared/Redux/LoginRedux'
import RoundedButton from '../RoundedButton'
import FormInput from '../FormInput'

import {
  Container,
  Title,
} from './Shared'

const RestyledInput = styled(FormInput)`
  margin: 120px 0 50px;
`

const SuccessMessage = styled.p`
  color: ${props => props.theme.Colors.grey};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .7px;
`

const ErrorMessage = styled.p``
const MessageContainer = styled.div`
  margin: 120px 0 50px;
`

export const Constants = {
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const validate = (values) => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!Constants.EMAIL_REGEX.test(values.email)) {
    errors.email = 'Invalid email address'
  } 
  return errors
}

class ResetPassword extends React.Component {
  static PropTypes = {
    onAttemptResetPassword: PropTypes.func,
    error: PropTypes.object,
    fetching: PropTypes.bool,
  }
  constructor(){
    super()
    this.state = {
      showMessage: false
    }
  }
  componentWillReceiveProps(nextProps) {
    // User has just received a success or fail action in response to resetPasswordRequest
    if (this.props.fetching && !nextProps.fetching) {
      this.setState({
        showMessage: true,
      })
    }
  }
  render() {
    const { error, email } = this.props
    return (
      <Container>
        <Title>RESET PASSWORD</Title>
        { 
          this.state.showMessage
          ?
          <MessageContainer>  
          {
            error
            ?
            <ErrorMessage>{error}</ErrorMessage>
            :
            <SuccessMessage>If this email is associated with an account, you will receive an email shortly.</SuccessMessage>
          }
          </MessageContainer>
          :
          <div>
            <Field
              name='email'
              component={RestyledInput}
              type='text'
              placeholder='Email'
            />
            <RoundedButton
              text='SUBMIT'
              width='100%'
              margin='none'
              height='39px'
              onClick={() => {
                this.props.onAttemptResetPassword(email)}}
              disabled={this.props.invalid}
            />
          </div>
        }
      </Container>
    )
  }
}

const selector = formValueSelector('loginForm')
export default R.compose(
  connect(
    (state) => {
      return {
        fetching: state.login.fetching,
        error: state.login.error,
        email: _.trim(selector(state, 'email')),
      }
    },
    (dispatch) => {
      return {
        onAttemptResetPassword: (email) => {
          return dispatch(LoginActions.resetPasswordRequest(email))
        }
      }
    }
  ),
  reduxForm({
    form: 'loginForm',
    destroyOnUnmount: true,
    validate,
    initialValues: {
      email: '',
    },
  })
)(ResetPassword)
