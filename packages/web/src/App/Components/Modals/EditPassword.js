import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import InputWithLabel from '../InputWithLabel'
import CenteredButtons from '../CenteredButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import { ErrorMessage, FetchingMessage } from './Shared/'

const Container = styled.div``

const InputContainer = styled.div`
  padding: 25px;
`

export default class EditPassword extends React.Component {

  static propTypes = {
    attemptChangePassword: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
    userId: PropTypes.string,
  }

  constructor(){
    super()
    this.state = {
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
      localError: '',
      success: false,
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.loginReduxFetching && !this.props.loginReduxFetching && !this.props.loginReduxError){
      this.setState({
        success: true,
      })
    }
  }

  onChangeText = (e) => {
    const text = e.target.value
    const field = e.target.id
    this.setState({
      [field]: text
    })
  }

  createValidateError = () => {
    if (this.state.newPassword !== this.state.retypePassword) {
      return 'Please ensure that you retyped your new password correctly.'
    } else {
      return {}
    }
  }

  submit = () => {
    const error = this.createValidateError()
    if(!_.isEmpty(error)){
      this.setState({
        localError: error
      })
    } else {
      this.setState({
        localError: '',
      })
      this.props.attemptChangePassword(this.props.userId, this.state.oldPassword, this.state.newPassword)
    }
  }

  clearFields = () => {
    this.setState({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
      localError: '',
      success: false,
    })
  }

  renderButtonLeft = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Cancel'}
          margin='none'
          width='116px'
          type='blackWhite'
          padding='mediumEven'
          onClick={this.clearFields}
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Save Password'}
          margin='none'
          width='180px'
          padding='mediumEven'
          onClick={this.submit}
        />
      </VerticalCenter>
    )
  }

  render() {
    const { loginReduxFetching, loginReduxError } = this.props
    return (
      <Container>
        <InputContainer>
          <InputWithLabel
            id='oldPassword'
            name='oldPassword'
            placeholder=''
            label='Old Password'
            type='password'
            onChange={this.onChangeText}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            id='newPassword'
            name='newPassword'
            placeholder=''
            label='New Password'
            type='password'
            onChange={this.onChangeText}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            id='retypePassword'
            name='retypePassword'
            placeholder=''
            label='Retype Password'
            type='password'
            onChange={this.onChangeText}
          />
        </InputContainer>
        {this.state.localError &&
          <ErrorMessage>
            {this.state.localError}
          </ErrorMessage> }
        {!!(loginReduxError) &&
          <ErrorMessage>
            {loginReduxError.toString()}
          </ErrorMessage> }
        {loginReduxFetching &&
          <FetchingMessage>
            Fetching...
          </FetchingMessage>}
        {this.state.success &&
          <FetchingMessage>
            You have successfully changed your info.
          </FetchingMessage>}
        <CenteredButtons
          buttonsToRender={[
            this.renderButtonLeft,
            this.renderButtonRight,
          ]}
        />
      </Container>
    )
  }
}
