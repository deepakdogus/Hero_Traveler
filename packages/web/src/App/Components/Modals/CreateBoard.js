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

export default class CreateBoard extends React.Component {

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
          text={'Create'}
          margin='none'
          width='138px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        <RightTitle>CREATE BOARD</RightTitle>
        <InputContainer>
          <StyledInput placeholder='Enter a title for your board'/>
        </InputContainer>
        <SpaceBetweenRowWithLeftRightButtons
          renderButtonL={this.renderButtonL}
          renderButtonR={this.renderButtonR}
        />
      </Container>
    )
  }
}
