import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)`
  flex-wrap: nowrap;
  max-width: 75%;
`
const Right = styled(Row)``

// this Component should only be used for horizontal placement
// it is the rough scaffolding of a number of rows
export default class SpaceBetweenRow extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderRight: PropTypes.func,
  }

  render() {
    const {renderImage, renderText, renderRight} = this.props
    return (
      <Row between='xs'>
        <Left>
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
