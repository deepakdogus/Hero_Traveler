import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ImageWrapper from './ImageWrapper'

const StyledImage = styled(ImageWrapper)`
  cursor: ${props => props.onClick ? 'pointer' : 'inherit'};
  position: relative;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  ${props => props.textProps}
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveProps}
  }
`

const StyledIcon = styled(Icon)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  ${props => props.textProps}
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveProps}
  }
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    iconTextProps: PropTypes.string,
    imageTextProps: PropTypes.string,
    responsiveProps: PropTypes.string,
    children: PropTypes.object,
  }

  render() {
    const {
      avatarUrl,
      size,
      type,
      onClick,
      iconTextProps,
      imageTextProps,
      responsiveProps,
      children,
    } = this.props

    if (!avatarUrl) {
      return (
        <StyledIcon
          name={type === 'profile' ? 'defaultProfile' : 'user-circle-o'}
          size={size}
          onClick={onClick}
          textProps={iconTextProps}
          responsiveProps={responsiveProps}
        >
          {children}
        </StyledIcon>
      )
    }
    else {
      return (
        <StyledImage
          src={avatarUrl}
          type={size || 'avatar'}
          onClick={onClick}
          textProps={imageTextProps}
          responsiveProps={responsiveProps}
        >
          {children}
        </StyledImage>
      )
    }
  }
}
