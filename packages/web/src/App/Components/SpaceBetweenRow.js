import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)`
  max-width: ${props => props.data['max-width']};
  flex-wrap: ${props => props.data['flex-wrap']};
`
const Right = styled(Row)``

// this Component should only be used for horizontal placement
// it is the rough scaffolding of a number of rows
export default class SpaceBetweenRow extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderRight: PropTypes.func,
    leftProps: PropTypes.object,
  }

  render() {
    const {renderImage, renderText, renderRight, leftProps } = this.props

    // Note to Matthew: I'm putting these extra props into 'data' toa void this console warning
    // Unknown props `max-width`, `flex-wrap` on <div> tag
    return (
      <Row between='xs'>
        <Left data={leftProps}> 
          <Col>
            {renderImage()}
          </Col>
          <Col>
            {renderText()}
          </Col>
        </Left>
        <Right>
          {renderRight()}
        </Right>
      </Row>
    )
  }
}
