import React from 'react'
import styled from 'styled-components'

import InputRow from '../InputRow'
import {RightTitle, StyledInput} from './Shared'
import SpaceBetweenRowWithLeftRightButtons from '../SpaceBetweenRowWithLeftRightButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import ModalTogglebar from '../ModalTogglebar'

const toggleBarTabs = [
  { text: 'Account', isActive: true, isLast: false },
  { text: 'Services', isActive: false, isLast: false },
  { text: 'Notifications', isActive: false, isLast: false },
  { text: 'Password', isActive: false, isLast: true },
]

const Container = styled.div``

const ButtonsContainer = styled.div`
  padding: 25px;
`
const InputContainer = styled.div`
  padding: 25px;
`

export default class Settings extends React.Component {

  renderButtonL = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Cancel'}
          margin='none'
          width='138px'
          type='blackWhite'
        />
      </VerticalCenter>
    )
  }

  renderButtonR = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Save Password'}
          margin='none'
          width='138px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        <RightTitle>SETTINGS</RightTitle>
        <ModalTogglebar tabs={toggleBarTabs}/>
        <InputContainer>
          <StyledInput placeholder='Old Password'/>
        </InputContainer>
        <InputContainer>
          <StyledInput placeholder='New Password'/>
        </InputContainer>
        <InputContainer>
          <StyledInput placeholder='Retype Password'/>
        </InputContainer>
        <SpaceBetweenRowWithLeftRightButtons
          renderButtonL={this.renderButtonL}
          renderButtonR={this.renderButtonR}
        />
      </Container>
    )
  }
}
