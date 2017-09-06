import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const Left = styled(Row)``
const Right = styled(Row)``

const StyledCol = styled(Col)`
  margin-top: 8px;
  margin-left: 14px;
`

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithTripImage extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderTimestamp: PropTypes.func,
    renderTripImage: PropTypes.func,
  }

  render() {
    const {renderImage, renderText, renderTimestamp, renderTripImage} = this.props
    return (
      <Row between='xs'>
        <Left>
          {renderImage()}
          <StyledCol>
            {renderText()}
            <br/>
            {renderTimestamp()}
          </StyledCol>
        </Left>  
        <Right>
          {renderTripImage()}      
        </Right>    
      </Row>
    )
  }
}