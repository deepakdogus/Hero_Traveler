import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ImageWrapper from './ImageWrapper'

const StyledImage = styled(ImageWrapper)`
  cursor: ${props => props.onClick ? 'pointer' : 'inherit'};
  position: relative;
  right: ${props=> props.isProfileHeader || props.isNav ? '6px' : 'inherit'};
  bottom: ${props => props.isNav ? '2px' : 'inherit'};
  margin-right: ${props => props.isStoryPreview ? '7.5px' : '0'};
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
  right: ${props => props.isProfileHeader ? '6px' : 'inherit'};
  bottom: ${props => props.isNav ? '1px' : 'inherit'};
  margin-right: ${props => props.isStoryPreview ? '7.5px' : '0'};
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
    isStoryPreview: PropTypes.bool,
    isProfileHeader: PropTypes.bool,
    isNav: PropTypes.bool,
    responsiveProps: PropTypes.string,
    children: PropTypes.object,
  }

  render() {
    const {
      avatarUrl,
      size,
      type,
      onClick,
      isStoryPreview,
      isProfileHeader,
      isNav,
      responsiveProps,
      children,
    } = this.props

    if (!avatarUrl) {
      return (
        <StyledIcon
          name={type === 'profile' ? 'defaultProfile' : 'user-circle-o'}
          size={size}
          onClick={onClick}
          isProfileHeader={isProfileHeader}
          isStoryPreview={isStoryPreview}
          responsiveProps={responsiveProps}
          isNav={isNav}
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
          isProfileHeader={isProfileHeader}
          isStoryPreview={isStoryPreview}
          isNav={isNav}
          responsiveProps={responsiveProps}
        >
          {children}
        </StyledImage>
      )
    }
  }
}
