import React from 'react'
import PropTypes from 'prop-types'

import Icon from './Icon'
import Image from './Image'

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
  }

  render() {
    const {avatarUrl, size} = this.props
    if (!avatarUrl) {
      return (
        <Icon
          name='user-circle-o'
          size={size}
        />
      )
    }
    else {
      return (
        <Image 
          src={avatarUrl}
          type={size === 'large' ? 'avatar-large' : 'avatar'}
        />
      )
    }
  }
}