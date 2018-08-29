import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import Image from './Image'

const StyledImage = styled(Image)`
  cursor: ${props => props.onClick ? 'pointer' : undefined};
  position: relative;
  right: 6px;
  bottom: 2px;
  margin-left: ${props => props.isStoryPreview ? '7px':'0'};
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    isStoryPreview: PropTypes.bool,
    size: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
  }

  render() {
    const {
      avatarUrl,
      size,
      type,
      onClick,
      isStoryPreview
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
        />
      )
    }
  }
}
