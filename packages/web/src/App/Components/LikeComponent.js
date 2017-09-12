import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'
import {Row} from './FlexboxGrid'

const Likes = styled.span`
  color: ${props => props.theme.Colors.snow};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1.5px;
  margin: auto 5px;
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
      <Row middle='xs'>
        <Likes>{this.props.likes}</Likes>
        <Icon
          name={this.props.isLiked ? 'like-active' : 'like'}
          size={'small'}
        />
      </Row>
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
