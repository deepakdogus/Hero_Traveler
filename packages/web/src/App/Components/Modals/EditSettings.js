import React from 'react'
import { connect } from 'react-redux'

import styled from 'styled-components'
import PropTypes from 'prop-types'
import InputWithLabel from '../InputWithLabel'
import CenteredButtons from '../CenteredButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import EditMessages from './EditMessages'
import UserActions from '../../Shared/Redux/Entities/Users'

const Container = styled.div``

const InputContainer = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-style: none;
  letter-spacing: .2px;
  padding: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const DeleteContainer = styled.div`
  padding: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
<<<<<<< HEAD
`

const DeleteTextContainer = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.signupGrey};
  padding-top: 15px;
  font-size: 15px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 25px;
  } 
`

const DeleteButton = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  border: solid;
  border-color: ${props => props.theme.Colors.dividerGrey};
  border-width: 0 0 1px;
  padding-bottom: 8px;
  width: 100%;
  letter-spacing: .2px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 25px;
  } 
=======
>>>>>>> 1f7cd0bfe284ea83ec1a40ae59e082ef74b004e1
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
  },
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
  },
]

class EditSettings extends React.Component{
  static propTypes ={
    deleteUser: PropTypes.func,
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
      showDeleteAccountConfirmation: false,
    }
  }

  componentDidMount(){
    if (this.props.type === 'account') this.loadInitialData()
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.isUpdating && !this.props.isUpdating)
      && !this.props.errorObj
    ) {
      setTimeout(()=> this.setState({success: false}), 5000)
      this.setState({success: true})
    }
  }

  loadInitialData = () => {
    this.setState({
      email: this.props.userEmailOrId,
      name: this.props.userProfile.fullName,
    })
  }

  onChangeText = (e) => {
    const text = e.target.value
    const field = e.target.id
    this.setState({
      [field]: text,
    })
  }

  cancel = () => {
    this.setState({
      localError: '',
      newPassword: '',
      oldPassword: '',
      retypePassword: '',
      success: false,
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
        localError: 'There are no changes to save.',
      })
    }
    else {
      this.setState({
        localError: '',
      })
      this.props.updateAction(updates)
    }
  }

  submitPasswordChanges = () => {
    if (this.state.newPassword !== this.state.retypePassword){
      this.setState({
        localError: 'Please ensure that you retyped your new password correctly.',
      })
    }
    else if (!this.state.newPassword || !this.state.retypePassword) {
      this.setState({
        localError: 'Please ensure that you filled out all fields correctly.',
      })
    }
    else {
      this.setState({
        localError: '',
      })
        this.props.updateAction(
          this.props.userEmailOrId,
          this.state.oldPassword,
          this.state.newPassword,
        )
      }
    }

  showDeleteAccountOptions = () => {
    this.setState({showDeleteAccountConfirmation: true})
  }

  hideDeleteAccountOptions = () => {
    this.setState({showDeleteAccountConfirmation: false})
  }

  getButtonProps (type, state, buttonSide) {
    if (buttonSide === 'right') {
      if (type === 'password') return {
        text: 'Save Password',
        onClick: this.submitPasswordChanges,
      }
      if (state.showDeleteAccountConfirmation) return {
        text: 'Delete Account',
        onClick: this.props.deleteUser,
      }
      else return {
        text: 'Save Changes',
        onClick: this.submitAccountChanges,
      }
    }
    if (buttonSide === 'left') {
      if (state.showDeleteAccountConfirmation) return {
        text: 'Cancel',
        onClick: this.hideDeleteAccountOptions,
      }
      else return {
        text: 'Cancel',
        onClick: this.cancel,
      }
    }
  }

  renderButtonLeft = () => {
    const {text, onClick} = this.getButtonProps(this.props.type, this.state, 'left')

    return (
      <VerticalCenter>
        <RoundedButton
          text={text}
          margin='none'
          width='116px'
          type='blackWhite'
          padding='mediumEven'
          onClick={onClick}
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    const {text, onClick} = this.getButtonProps(this.props.type, this.state, 'right')

    return (
      <VerticalCenter>
        <RoundedButton
          text={text}
          margin='none'
          width='180px'
          padding='mediumEven'
          onClick={onClick}
        />
      </VerticalCenter>
    )
  }

  renderInputs = () => {
    const inputArr = this.props.type === 'account' ? accountInputs : passwordInputs
    const fontColor = this.props.type === 'account' ? undefined : 'background'
    return inputArr.map((inputObj, index) => {
      return (
        <InputContainer
          key={index}
        >
          <InputWithLabel
            {...inputObj}
            onChange={this.onChangeText}
            value={this.state[inputObj.id]}
            fontColor={fontColor}
          />
        </InputContainer>
      )
    })
  }

  renderDeleteButton = () => {
    return (
      <DeleteContainer>
        <DeleteButton onClick={this.showDeleteAccountOptions}>Delete Account</DeleteButton>
        {!!this.state.showDeleteAccountConfirmation &&
        <DeleteTextContainer>
        We’re sorry to see you go. Once your account is deleted, all of your content will be permanently gone.
        </DeleteTextContainer>}
      </DeleteContainer>
    )
  }

  render() {
    const { isUpdating, errorObj} = this.props
    const inputs = this.renderInputs()

    return (
      <Container>
        {!!inputs && inputs}
        <EditMessages
          isUpdating={isUpdating}
          errorObj={errorObj}
          localError={this.state.localError}
          success={this.state.success}
        />
        {this.props.type === 'account' ? this.renderDeleteButton() : null }
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

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: () => dispatch(UserActions.deleteUser()),
  }
}

export default connect(null, mapDispatchToProps)(EditSettings)
