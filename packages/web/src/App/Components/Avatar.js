import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'
import Image from './Image'

const RoundedContainer = styled.div`
  border-radius: 30px;
`

export default class Avatar extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
  }

  render() {
    const {avatarUrl} = this.props
    if (!avatarUrl) {
      return (<Icon name='user-circle-o'/>)
    }
    else {
      return (
        <Image 
          src={avatarUrl}
          type='avatar'
        />
      )
    }
  }
}