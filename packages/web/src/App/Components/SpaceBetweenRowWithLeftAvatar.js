import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

// const Left = styled(Row)``
// const Right = styled(Row)``

const TextBox = styled.div`
  background-color: ${props => props.theme.Colors.blueBubble};
  border-radius: 3px;
  padding: 25px;
  margin-top: 10px;
`

const TextBoxArrow = styled.div`
  width: 0; 
  height: 0; 
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;  
  border-right:8px solid ${props => props.theme.Colors.blueBubble};
  transform: translate(0px,35px)
`



// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithLeftAvatar extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderTimestamp: PropTypes.func,
  }

  render() {
    const {renderImage, renderText, renderTimestamp} = this.props
    return (
      <Row between='xs'>
          <Col>
            {renderImage()}
          </Col>
          <Col>
            {renderTimestamp()}
            <Row>
              <TextBoxArrow></TextBoxArrow>
              <TextBox>
                {renderText()}
              </TextBox>
            </Row>
          </Col>
          <Col>
            {''}
          </Col>
      </Row>
    )
  }
}