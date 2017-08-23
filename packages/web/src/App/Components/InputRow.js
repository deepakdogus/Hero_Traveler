import React, { Component } from 'react'
import styled from 'styled-components'

import SpaceBetweenRowWithInputAndButton from './SpaceBetweenRowWithInputAndButton'
import VerticalCenter from './VerticalCenter'
import {RightTitle, StyledInput} from './Modals/Shared'
import RoundedButton from './RoundedButton'
import HorizontalDivider from './HorizontalDivider'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`
const InputContainer = styled.div`
  padding: 25px;
`


export default class InputRow extends Component {

  renderInput = () => {
    return (
      <StyledVerticalCenter>
        <InputContainer>
          <StyledInput placeholder='Add a comment...'/>
        </InputContainer>        
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text='Send'
          margin='none'
          width='100px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <HorizontalDivider color='light-grey'/>
        <RightTitle>
          <SpaceBetweenRowWithInputAndButton
            renderInput={this.renderInput}
            renderButton={this.renderButton}
          />
        </RightTitle>
      </Container>
    )
  }
}
