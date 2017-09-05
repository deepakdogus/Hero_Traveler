import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import VerticalCenter from './VerticalCenter'

function getMargin(props) {
  if (props.margin === 'none') return 0;
  else if (props.margin === 'small') return '3px'
  else if (props.margin === 'vertical') return '5px 0'
  return `${props.theme.Metrics.baseMargin}px ${props.theme.Metrics.section}px`
}

// 2px 6px 3px is default react padding.
function getPadding(props) {
  if (props.padding ==='even') return '5px';
  return '2px 6px 3px'
}

const StyledButton = styled.button`
  height: ${props => props.height || 'auto'};
  border-style: none;
  margin: ${props => getMargin};
  padding: ${props => getPadding};
  background-color: transparent;
  width: ${props => props.width || 'inherit'};
`
const Text = styled.p`
  color: ${props => {
    console.log("props: ", props)

    switch(props.type) {
      case 'blackWhite':
        return props.theme.Colors.photoOverlay
      default:
        return props.theme.Colors.red
    }
  }};
  text-align: ${props => {
    switch(props.textAlign) {
      case 'right':
        return 'right'
      case 'left':
        return 'left'        
      default:
        return 'center'
    }
  }};
  font-size: 16px;
  font-weight: 400;
  margin: ${props => {
    switch(props.textAlign) {
      case 'right':
        return '2.5px 0px'
      default:
        return '2.5px 10px'
    }
  }};
  letter-spacing: ${props => {
    switch(props.textAlign) {
      case 'right':
        return '.7px'
      default:
        return '1.5px'
    }
  }};
`

/*
Can provide RoundedButton with either straight text or children
Children will supplant the text
*/
export default class TextButton extends React.Component {
  static PropTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    textAlign: PropTypes.string,
    width: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    height: PropTypes.string,
  }

  renderContent() {
    const {text, children, type, textAlign} = this.props
    if (children) return children
    else return (<Text textAlign={textAlign} type={type}>{text}</Text>)
  }

  render() {
    return (
      <StyledButton {...this.props}>
        <VerticalCenter>
          {this.renderContent()}
        </VerticalCenter>
      </StyledButton>
    )
  }
}
