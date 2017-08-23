import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from './FlexboxGrid'

const Left = styled(Row)`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 23%;
`
const Right = styled(Row)`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 23%;
`

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithLeftRightButtons extends Component {
  static propTypes = {
    renderButtonLeft: PropTypes.func,
    renderButtonRight: PropTypes.func,
  }

  render() {
    const {renderButtonLeft, renderButtonRight} = this.props
    return (
      <Row between='xs'>
        <Left>
          {renderButtonLeft()}
        </Left>
        <Right>
          {renderButtonRight()}
        </Right>
      </Row>
    )
  }
}
