import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import ImageWrapper from './ImageWrapper'

const StyledImage = styled(ImageWrapper)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: ${props=> props.isProfileHeader ? '0' : '6'}px;
  bottom: 2px;
  margin-left: ${props => props.isStoryPreview ? '7px':'0'};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
        <Icon
          name={type === 'profile' ? 'defaultProfile' : 'user-circle-o'}
          size={size}
          onClick={onClick}
        />
      )
    }
    else {
      return (
        <StyledImage
          isStoryPreview={isStoryPreview}
          src={avatarUrl}
          type={size || 'avatar'}
          onClick={onClick}
          isProfileHeader={isProfileHeader}
        />
      )
    }
  }
}
