import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, SettingsStyledInput, StyledInputLabel, RightModalCloseX} from './Shared'
import SpaceBetweenRowWithLeftRightButtons from '../SpaceBetweenRowWithLeftRightButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import ModalTogglebar from '../ModalTogglebar'

const toggleBarTabs = [
  { text: 'Account', isActive: false, isLast: false },
  { text: 'Services', isActive: false, isLast: false },
  { text: 'Notifications', isActive: false, isLast: false },
  { text: 'Password', isActive: true, isLast: true },
]

const Container = styled.div``

const InputContainer = styled.div`
  padding: 25px;
`

export default class SettingsPassword extends React.Component {
    static propTypes = {
    toggleModal: PropTypes.func,
    closeModal: PropTypes.func,
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
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar toggleModal={this.props.toggleModal} tabs={toggleBarTabs}/>
        <InputContainer>
          <StyledInputLabel for='oldPassword'>Old Password</StyledInputLabel>
          <SettingsStyledInput type='password' id='oldPassword'/>
        </InputContainer>
        <InputContainer>
          <StyledInputLabel for='newPassword'>New Password</StyledInputLabel>
          <SettingsStyledInput type='password' id='newPassword'/>
        </InputContainer>
        <InputContainer>
          <StyledInputLabel for='retypePassword'>Retype Password</StyledInputLabel>
          <SettingsStyledInput type='password' id='retypePassword'/>
        </InputContainer>
        <SpaceBetweenRowWithLeftRightButtons
          renderButtonLeft={this.renderButtonLeft}
          renderButtonRight={this.renderButtonRight}
        />
      </Container>
    )
  }
}
