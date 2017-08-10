import React from 'react'
import styled from 'styled-components'

import InputRow from '../InputRow'
import {RightTitle, StyledInput} from './Shared'
import SpaceBetweenRowWithLeftRightButtons from '../SpaceBetweenRowWithLeftRightButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'

const Container = styled.div``

const ButtonsContainer = styled.div`
  padding: 25px;
`
const InputContainer = styled.div`
  padding: 25px;
`

export default class SettingsPW extends React.Component {

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
          text={'Save Changes'}
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
        
        <InputContainer>
          <StyledInput placeholder='Name'/>
        </InputContainer>
        <InputContainer>
          <StyledInput placeholder='Email'/>
        </InputContainer>
        <InputContainer>
          <StyledInput placeholder='Password'/>
        </InputContainer>
        <SpaceBetweenRowWithLeftRightButtons
          renderButtonL={this.renderButtonL}
          renderButtonR={this.renderButtonR}
        />
      </Container>
    )
  }
}
