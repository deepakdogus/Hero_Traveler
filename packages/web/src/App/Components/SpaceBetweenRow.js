import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Row, Col } from './FlexboxGrid'

const Left = styled(Row)`
  max-width: ${props => props.data['max-width']};
  flex-wrap: ${props => props.data['flex-wrap']};
  align-items: ${props => props.data['align-items']};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    max-width: ${props => props.data['tablet-max-width']}
  }
`
const Right = styled(Row)``

const ResponsiveRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.data['justify-content']};
  align-items: center;
  width: 100%;
  flex-wrap: ${props => props.data['flex-wrap']};
`

// this Component should only be used for horizontal placement
// it is the rough scaffolding of a number of rows
export default class SpaceBetweenRow extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderRight: PropTypes.func,
    leftProps: PropTypes.object,
    rowProps: PropTypes.object,
  }

  render() {
    const {
      renderImage,
      renderText,
      renderRight,
      leftProps = {},
      rowProps = {'justify-content': 'space-between'},
    } = this.props

    return (
      <ResponsiveRow data={rowProps}>
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
      </ResponsiveRow>
    )
  }
}
