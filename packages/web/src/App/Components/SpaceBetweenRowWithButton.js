import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)``
const Right = styled(Row)``

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithButton extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderButton: PropTypes.func,
  }

  render() {
    const {renderImage, renderText, renderButton} = this.props
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
          {renderButton()}
        </Right>
      </Row>
    )
  }
}
