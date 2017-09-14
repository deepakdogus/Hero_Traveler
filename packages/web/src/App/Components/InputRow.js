import React, { Component } from 'react'
import styled from 'styled-components'

import VerticalCenter from './VerticalCenter'
import RoundedButton from './RoundedButton'
import HorizontalDivider from './HorizontalDivider'
import {Row} from './FlexboxGrid'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
  position: absolute;
  left: 0;
  bottom: 0;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

const InputFooter = styled.div`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  margin: 0;
  width: 510px;
  padding: 30px;
  height: 30px;
  position: relative;
`

const StyledFooterInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  letter-spacing: .7px;
  width: 380px;
  color: ${props => props.theme.Colors.grey};
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 18px;
  outline: none;
  margin-right: 2%;
`


export default class InputRow extends Component {
  render() {
    return (
      <Container margin={this.props.margin}>
        <StyledHorizontalDivider color='light-grey'/>
        <InputFooter>
          <VerticalCenter>
            <Row>
              <StyledFooterInput placeholder='Add a comment...'/>
              <RoundedButton
                text='Send'
                margin='none'
                width='94px'
                padding='medium'
              />
            </Row>
          </VerticalCenter>
        </InputFooter>
      </Container>
    )
  }
}
