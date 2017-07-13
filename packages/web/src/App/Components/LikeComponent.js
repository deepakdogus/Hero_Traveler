import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'

const Inline = styled.div`
  display: inline-block;
`

export default class LikeComponent extends React.Component {
  static propTypes: {
    likes: PropTypes.number,
    isLiked: PropTypes.bool,
    onPress: PropTypes.func,
  }

  render() {
    let rootComponent
    const container = (
      <Inline>
        <span>{this.props.likes}</span>
        <Icon
          name={this.props.isLiked ? 'like-active' : 'like'}
          size={'small'}
        />
      </Inline>
    )

    if(this.props.onPress) {
      rootComponent = (
        <button
          onPress={this.props.onPress}
          children={container}
        />
      )
    } else {
      rootComponent = container
    }

    return (
      rootComponent
    )
  }
}
