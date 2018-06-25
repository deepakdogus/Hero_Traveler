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
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
  }

  render() {
    const {avatarUrl, size, type, onClick} = this.props
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
          src={avatarUrl}
          type={size || 'avatar'}
          onClick={onClick}
        />
      )
    }
  }
}
