import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)``
const Right = styled(Row)``

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithInputAndButton extends Component {
  static propTypes = {
    renderInput: PropTypes.func,
    renderButton: PropTypes.func,
  }

  render() {
    const {renderInput, renderButton} = this.props
    return (
      <Row between='xs'>
        <Left>
          <Col>
          {renderInput()}
          </Col>
        </Left>
        <Right>
          {renderButton()}
        </Right>
      </Row>
    )
  }
}
