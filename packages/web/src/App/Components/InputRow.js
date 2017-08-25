import React, { Component } from 'react'
import styled from 'styled-components'

import SpaceBetweenRowWithInputAndButton from './SpaceBetweenRowWithInputAndButton'
import VerticalCenter from './VerticalCenter'
import {RightTitle, StyledInput} from './Modals/Shared'
import RoundedButton from './RoundedButton'
import HorizontalDivider from './HorizontalDivider'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
  position: absolute;
  left: 0;
  bottom: 0;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

export const InputFooter = styled.div`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  margin: 0;
  width: 510px;
  padding: 30px;
  height: 30px;
  position: relative;
`

export const StyledFooterInput = styled.input`
  font-weight: 400;
  letter-spacing: .7px;
  width: 380px;
  color: ${props => props.theme.Colors.grey};
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 18px;
  outline: none;
`


export default class InputRow extends Component {

  renderInput = () => {
    return (
      <VerticalCenter>
          <StyledFooterInput placeholder='Add a comment...'/>      
      </VerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text='Send'
          margin='none'
          width='94px'
          padding='mediumDefault'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <StyledHorizontalDivider color='light-grey'/>
        <InputFooter>
          <SpaceBetweenRowWithInputAndButton
            renderInput={this.renderInput}
            renderButton={this.renderButton}
          />
        </InputFooter>
      </Container>
    )
  }
}
