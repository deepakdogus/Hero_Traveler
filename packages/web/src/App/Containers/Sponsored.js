import React, { Component } from 'react'
import styled from 'styled-components'
import HorizontalDivider from '../Components/HorizontalDivider'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    border-color: transparent;
    background-color: transparent;
    margin-top: 0;
    margin-bottom: 15px;
  }
`
const BioText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro}};
  font-style: normal;
  font-weight: 400;
  letter-spacing: .2px;
  text-align: left;
  font-size: 16px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  margin: 20px auto;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
    font-weight: 600;
    margin: 4px 0 0;
  }
`

const Centered = styled.div`
  x
`

export default class Sponsored extends Component {
    render() {
      return (
        <Centered>
          <StyledDivider color={'grey'} />
          <BioText onClick={null}>Read Bio</BioText>
        </Centered>
      )
    }
}
