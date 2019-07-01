import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { sizes } from '../Shared/Web/Themes/Metrics'
import HorizontalDivider from './HorizontalDivider'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 0.6px;
  padding: 30px 0 0 0;
  @media (max-width: ${sizes.tablet}px) {
    padding: 20px;
    font-size: 18px;
  }
`

const Wrapper = styled.div``

const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  margin-bottom: 23px;
  max-width: 960px;
  @media (max-width: ${sizes.tablet}px) {
    display: none;
  }
`

export default class HeadlineDivider extends Component {
  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    const { title } = this.props
    return (
      <Wrapper>
        <FeedText>{title}</FeedText>
        <StyledDivider />
      </Wrapper>
    )
  }
}
