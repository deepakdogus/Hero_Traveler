import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ImageWrapper from './ImageWrapper'

const StyledImage = styled(ImageWrapper)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: ${props=> props.isProfileHeader ? '6' : '0'}px;
  bottom: 2px;
  margin-right: ${props => props.isStoryPreview ? '7.5px': '0'};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const StyledIcon = styled(Icon)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: ${props=> props.isProfileHeader ? '0' : '6'}px;
  bottom: ${props=> props.isProfileHeader ? '1' : '0'}px;
  margin-left: ${props => props.isStoryPreview ? '7px' : '0'};
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    isStoryPreview: PropTypes.bool,
    size: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    isProfileHeader: PropTypes.bool,
  }

  render() {
    const {
      avatarUrl,
      size,
      type,
      onClick,
      isStoryPreview,
      isProfileHeader,
    } = this.props

    if (!avatarUrl) {
      return (
        <StyledIcon
          name={type === 'profile' ? 'defaultProfile' : 'user-circle-o'}
          size={size}
          onClick={onClick}
          isProfileHeader={isProfileHeader}
          isStoryPreview={isStoryPreview}
        />
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
        />
      )
    }
  }
}
