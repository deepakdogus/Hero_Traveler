import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

function getMargin(props) {
  if (props.margin === 'none') return 0;
  return `${props.theme.Metrics.baseMargin}px ${props.theme.Metrics.section}px`
}

const StyledButton = styled.button`
  border-radius: 30px;
  border: 1px solid;
  border-color: ${props => {
    switch(props.type) {
      case 'opaque':
        return `${props.theme.Colors.snow}`
      case 'blackWhite':
        return `${props.theme.Colors.photoOverlay}`
      default:
        return `${props.theme.Colors.red}`
    }
  }};
  margin: ${(props) => getMargin};
  background-color: ${props => {
    switch(props.type) {
      case 'opaque':
        return `${props.theme.Colors.windowTint}`
      case 'blackWhite':
        return `${props.theme.Colors.snow}`
      default:
        return `${props.theme.Colors.red}`
    }
  }};
`
const Text = styled.p`
  color: ${props => {
    switch(props.type) {
      case 'blackWhite':
        return `${props.theme.Colors.photoOverlay}`
      default:
        return `${props.theme.Colors.snow}`
    }
  }};
  text-align: center;
  font-size: ${props => `${props.theme.Fonts.size.medium}px`};
  margin: 2.5px 10px;
`

/*
Can provide RoundedButton with either straight text or children
Children will supplant the text
*/
export default class RoundedButton extends React.Component {
  static PropTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    onclick: PropTypes.func,
    type: PropTypes.string,
  }

  renderContent() {
    const {text, children, type} = this.props
    if (children) return children
    else return (<Text type={type}>{text}</Text>)
  }

  render() {
    return (
      <StyledButton {...this.props}>
        {this.renderContent()}
      </StyledButton>
    )
  }
}
