import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from './FlexboxGrid'

const Left = styled(Row)``
const Right = styled(Row)``

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithButton extends Component {
  static propTypes = {
    renderText: PropTypes.func,
    renderSwitch: PropTypes.func,
  }

  render() {
    const {renderText, renderSwitch} = this.props
    return (
      <Row between='xs'>
        <Left>
          {renderText()}
        </Left>
        <Right>
          {renderSwitch()}
        </Right>
      </Row>
    )
  }
}
