import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25%;
`
const Right = styled(Row)`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 25%;
`

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithLeftRightButtons extends Component {
  static propTypes = {
    renderButtonL: PropTypes.func,
    renderButtonR: PropTypes.func,
  }

  render() {
    const {renderButtonL, renderButtonR} = this.props
    return (
      <Row between='xs'>
        <Left>
          {renderButtonL()}
        </Left>
        <Right>
          {renderButtonR()}
        </Right>
      </Row>
    )
  }
}
