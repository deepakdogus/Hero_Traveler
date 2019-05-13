import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from '../Shared/Web/Components/Icon'
import {StyledVerticalCenter} from './Modals/Shared'

const imageMetrics = {
  width: 115,
  height: 90,
}

const StyledImageWrapper = styled.div`
  margin: 20px 0;
  width: 115px;
  height: 90px;
  display: flex;
  justify-content: 'left';
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 67px;
    height: 50px;
  }
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`

export const DefaultContainer = styled.div`
  border: ${props => `0 solid ${props.theme.Colors.dividerGrey}`};
  border-width: ${props => props.index === 0 ? '1px 0 1px' : '0 0 1px'};
  padding: 5px 5px 0;
`

const Text = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 18px;
  font-weight: '400';
  letter-spacing: .2px;
  margin: 0;
  cursor: pointer;
`

export default class GuideSelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    guide: PropTypes.object,
    index: PropTypes.number,
    onSelect: PropTypes.func,
    ReplacementContainer: PropTypes.func,
  }

  onSelect = () => {
    this.props.onSelect(this.props.guide.id)
  }

  renderImage = () => {
    const { guide } = this.props
    const src = getImageUrl(
      guide.coverImage,
      'optimized',
      imageMetrics,
    )

    return (
      <StyledImageWrapper>
        <StyledImage
          src={src}
          alt={`Image for guide ${guide.title ? `titled ${guide.title}` : ''}`}
        />
      </StyledImageWrapper>
    )
  }

  renderText = () => {
    const { guide } = this.props

    return (
      <StyledVerticalCenter>
        <Text>{guide.title}</Text>
      </StyledVerticalCenter>
    )
  }

  renderRight = () => {
    const iconName = this.props.isSelected ? 'redCheck' : 'greyCheck'

    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  render() {
    const {
      index,
      ReplacementContainer,
      onSelect,
    } = this.props
    const Container = ReplacementContainer || DefaultContainer
    const containerProps = { index }
    if (onSelect) containerProps.onClick = this.onSelect

    return (
      <Container {...containerProps}>
        <SpaceBetweenRow
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderRight={this.renderRight}
        />
      </Container>
    )
  }
}
