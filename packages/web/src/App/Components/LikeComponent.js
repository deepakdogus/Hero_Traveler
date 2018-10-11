import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'
import {Row} from './FlexboxGrid'

const Likes = styled.span`
  color: ${props => props.horizontal ? props.theme.Colors.grey : props.theme.Colors.snow};
  font-family: ${props => props.horizontal ? props.theme.Fonts.type.sourceSansPro : props.theme.Fonts.type.montserrat};
  font-size: ${props => props.horizontal ? '15px' : '12px'};
  font-weight: 400;
  letter-spacing: ${props => props.horizontal ? '.7px' : '1.5px'};
  margin: ${props => props.horizontal ? '0 5px 0 0' : 'auto 5px'};
`

export default class LikeComponent extends React.Component {
  static propTypes = {
    likes: PropTypes.string,
    isLiked: PropTypes.bool,
    onClick: PropTypes.func,
    horizontal: PropTypes.bool,
  }

  render() {
    return (
      <Row middle='xs'>
        <Likes horizontal={this.props.horizontal}>{this.props.likes}</Likes>
        <Icon
          name={this.props.isLiked ? 'like-active-large' : 'like-large'}
          onClick={this.props.onClick}
        />
      </Row>
    )
  }
}
