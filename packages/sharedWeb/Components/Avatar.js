import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ImageWrapper from './ImageWrapper'

const StyledImage = styled(ImageWrapper)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: ${props=> props.isHeader ? '6' : '0'}px;
  bottom: 2px;
  margin-right: ${props => props.isFeedItemPreview ? '7.5px' : '0'};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveProps}
  }
`

const StyledIcon = styled(Icon)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: ${props => props.isHeader ? '0' : '6'}px;
  bottom: ${props => props.isHeader ? '1' : '0'}px;
  margin-right: ${props => props.isFeedItemPreview ? '7.5px' : '0'};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveProps}
  }
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    isFeedItemPreview: PropTypes.bool,
    size: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    isHeader: PropTypes.bool,
    responsiveProps: PropTypes.string,
  }

  render() {
    const {
      avatarUrl,
      size,
      type,
      onClick,
      isFeedItemPreview,
      isHeader,
      responsiveProps,
    } = this.props

    if (!avatarUrl) {
      return (
        <StyledIcon
          name={type === 'profile' ? 'defaultProfile' : 'iconHeaderProfile'}
          size={size}
          onClick={onClick}
          isHeader={isHeader || type === 'profile'}
          isFeedItemPreview={isFeedItemPreview}
          responsiveProps={responsiveProps}
        />
      )
    }
    else {
      return (
        <StyledImage
          src={avatarUrl}
          type={size || 'avatar'}
          onClick={onClick}
          isHeader={isHeader}
          isFeedItemPreview={isFeedItemPreview}
          responsiveProps={responsiveProps}
        />
      )
    }
  }
}
