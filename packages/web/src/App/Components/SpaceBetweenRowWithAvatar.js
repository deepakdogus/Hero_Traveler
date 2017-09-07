import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row, Col} from './FlexboxGrid'

const TextBox = styled.div`
  background-color: ${props => props.isSender ? props.theme.Colors.blueBubble : props.theme.Colors.lightGreyAreas};
  border-radius: 6px;
  padding: 25px;
  margin-top: 10px;
  width: 200px;
`

const StyledRow = styled(Row)`
  padding-top: 20px;
`

const StyledCol = styled(Col)`
  transform: ${props => props.isSender ? 'translateX(-70px)' : 'translateX(70px)'};
`

const TextBoxArrow = styled.div`
  width: 0; 
  height: 0; 
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right-width: ${props => props.isSender ? '9px' : '0px'};
  border-right-style: ${props => props.isSender ? 'solid' : 'none'};  
  border-right-color: ${props => props.isSender ? props.theme.Colors.blueBubble : 'none'};
  border-left-width: ${props => props.isSender ? '0px' : '9px'};
  border-left-style: ${props => props.isSender ? 'none' : 'solid'};  
  border-left-color: ${props => props.isSender ? 'none' : props.theme.Colors.lightGreyAreas};  
  transform: translate(0px,37px)
`

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithLeftAvatar extends Component {
  static propTypes = {
    renderImage: PropTypes.func,
    renderText: PropTypes.func,
    renderTimestamp: PropTypes.func,
    isSender: PropTypes.bool,
  }

  render() {
    const {renderImage, renderText, renderTimestamp, isSender} = this.props
    return (
      <Row between='xs'>
          <StyledRow bottom='xs'>
            {isSender ? renderImage() : ''}
          </StyledRow>
          <StyledCol {...this.props}>
            {renderTimestamp()}
            <Row>
              {isSender ? <TextBoxArrow {...this.props}/> : null}
              <TextBox {...this.props}>
                {renderText()}
              </TextBox>
              {isSender ? null : <TextBoxArrow {...this.props}/>}
            </Row>
          </StyledCol>
          <StyledRow bottom='xs'>
            {isSender ? '' : renderImage()}
          </StyledRow>
      </Row>
    )
  }
}