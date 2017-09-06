import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX} from './Shared'
import InputWithLabel from '../InputWithLabel'
import CenteredLeftRightButtons from '../CenteredLeftRightButtons'
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
          <InputWithLabel 
            id='oldPassword'
            name='oldPassword'
            placeholder=''
            label='Old Password'
            type='password'
          />          
        </InputContainer>
        <InputContainer>
          <InputWithLabel 
            id='newPassword'
            name='newPassword'
            placeholder=''
            label='New Password'
            type='password'
          />                    
        </InputContainer>
        <InputContainer>
          <InputWithLabel 
            id='retypePassword'
            name='retypePassword'
            placeholder=''
            label='Retype Password'
            type='password'
          />                              
        </InputContainer>
        <CenteredLeftRightButtons
          renderButtonLeft={this.renderButtonLeft}
          renderButtonRight={this.renderButtonRight}
        />
      </Container>
    )
  }
}
