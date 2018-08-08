import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import InputWithLabel from '../InputWithLabel'
import CenteredButtons from '../CenteredButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import EditMessages from './EditMessages'

const Container = styled.div``

const InputContainer = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-style: none;
  padding: 25px;
`

const accountInputs = [
  {
    value: '',
    id:'name',
    placeholder: 'John Doe',
    label: 'Name',
  },
  {
    id: 'email',
    name: 'email',
    placeholder: 'jdoe@gmail.com',
    label: 'Email',
  }
]

const passwordInputs = [
  {
    id: 'oldPassword',
    name: 'oldPassword',
    placeholder: '',
    label: 'Old Password',
    type: 'password',
  },
  {
    id: 'newPassword',
    name: 'newPassword',
    placeholder: '',
    label: 'New Password',
    type: 'password',
  },
  {
    id: 'retypePassword',
    name: 'retypePassword',
    placeholder: '',
    label: 'Retype Password',
    type: 'password',
  }
]

export default class EditSettings extends React.Component{
  static propTypes ={
    updateAction: PropTypes.func,
    userProfile: PropTypes.object,
    userEmailOrId: PropTypes.string,
    isUpdating: PropTypes.bool,
    errorObj: PropTypes.object,
    type: PropTypes.string,
  }

  constructor(){
    super()
    this.state = {
      localError: '',
      success: false,
    }
  }

  componentDidMount(){
    if (this.props.type === 'account') this.loadInitialData()
  }

  loadInitialData = () => {
    this.setState({
      email: this.props.userEmailOrId,
      name: this.props.userProfile.fullName
    })
  }

  onChangeText = (e) => {
    const text = e.target.value
    const field = e.target.id
    this.setState({
      [field]: text
    })
  }

  cancel = () => {
    this.setState({
      localError: '',
      newPassword: '',
      oldPassword: '',
      retypePassword: '',
      success: false
    })
    if (this.props.type === 'account') this.loadInitialData()
  }

  submitAccountChanges = () => {
    const updates = {}
    if (this.state.name !== this.props.userProfile.fullName) {
      updates.profile = {...this.props.userProfile, fullName: this.state.name}
    }
    if (this.state.email !== this.props.userEmailOrId) {
      updates.email = this.state.email
    }
    if (!(Object.keys(updates).length)) {
      this.setState({
        localError: 'There are no changes to save.'
      })
    } else {
      this.setState({
        localError: ''
      })
      this.props.updateAction(updates)
    }
  }

  submitPasswordChanges = () => {
    if (this.state.newPassword !== this.state.retypePassword){
      this.setState({
        localError: 'Please ensure that you retyped your new password correctly.'
      })
    } else {
      this.setState({
        localError: '',
      })
      if (!this.state.localError) {
        this.props.updateAction(
          this.props.userEmailOrId,
          this.state.oldPassword,
          this.state.newPassword,
        )
      }
    }
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
          onClick={this.cancel}
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={this.props.type === 'account' ? 'Save Changes' : 'Save Password'}
          margin='none'
          width='180px'
          padding='mediumEven'
          onClick={
            this.props.type === 'account'
            ? this.submitAccountChanges
            : this.submitPasswordChanges
          }
        />
      </VerticalCenter>
    )
  }

  renderInputs = () => {
    const inputArr = this.props.type === 'account' ? accountInputs : passwordInputs
    return inputArr.map((inputObj, index) => {
      return (
        <InputContainer
          key={index}
        >
          <InputWithLabel
            {...inputObj}
            onChange={this.onChangeText}
            value={this.state[inputObj.id]}
          />
        </InputContainer>
      )
    })
  }

  render() {
    const { isUpdating, errorObj} = this.props
    const inputs = this.renderInputs()

    return(
      <Container>
        {!!inputs && inputs}
        <EditMessages
          isUpdating={isUpdating}
          errorObj={errorObj}
          localError={this.state.localError}
          success={this.state.success}
        />
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
