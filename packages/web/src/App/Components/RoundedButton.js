import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import VerticalCenter from './VerticalCenter'

function getMargin(props) {
  if (props.margin === 'none') return 0;
  else if (props.margin === 'small') return '3px'
  else if (props.margin === 'medium') return '11px'
  else if (props.margin === 'vertical') return '5px 0'
  return `${props.theme.Metrics.baseMargin}px ${props.theme.Metrics.section}px`
}

// 2px 6px 3px is default react padding.
function getPadding(props) {
  if (props.padding ==='even') return '5px';
  if (props.padding ==='evenMedium') return '11px';
  return '2px 6px 3px'
}

function getBackgroundColor (type, colors) {
  switch(type) {
    case 'grey':
      return colors.btnGreyBackground
    case 'opaque':
      return colors.windowTint
    case 'opaqueWhite':
      return colors.whiteAlphaPt4
    case 'facebookSignup':
      return colors.facebook
    case 'twitterSignup':
      return colors.twitterBlue
    case 'blackWhite':
    case 'facebook':
    case 'twitter':
    case 'lightGrey':
      return colors.snow
    case 'opaqueGrey':
      return colors.snow
    case 'backgroundOpaque':
      return colors.backgroundOpaque       
    default:
      return colors.red
  }
}

const StyledButton = styled.button`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  height: ${props => props.height || 'auto'};
  border-radius: 30px;
  outline: none;
  border: 1px solid;
  border-color: ${props => {
    switch(props.type) {
      case 'lightGrey':
        return props.theme.Colors.signupGrey
      case 'facebook':
      case 'facebookSignup':
        return props.theme.Colors.facebook
      case 'twitter':
      case 'twitterSignup':
        return props.theme.Colors.twitterBlue
      case 'grey':
        return props.theme.Colors.btnGreyBackground
      case 'opaque':
      case 'opaqueWhite':
        return props.theme.Colors.snow
      case 'blackWhite':
        return props.theme.Colors.photoOverlay
      case 'opaqueGrey':
        return props.theme.Colors.grey
      case 'backgroundOpaque':
        return props.theme.Colors.closeXBorder 
      default:
        return props.theme.Colors.red
    }
  }};
  margin: ${props => getMargin};
  padding: ${props => getPadding};
  background-color: ${props => getBackgroundColor(props.type, props.theme.Colors)};
  width: ${props => props.width || 'inherit'};
  &:hover {
    background-color: ${props => {
      switch(props.type) {
        case 'grey':
          return props.theme.Colors.btnDarkGreyBackground
        default:
          return getBackgroundColor(props.type, props.theme.Colors)
      }
    }}
  }
`
const Text = styled.p`
  color: ${props => {
    switch(props.type) {
      case 'blackWhite':
        return props.theme.Colors.photoOverlay
      default:
        return props.theme.Colors.snow
    }
  }};
  text-align: center;
  font-size: 16px;
  margin: 2.5px 10px;
  letter-spacing: 1.2px;
`

/*
Can provide RoundedButton with either straight text or children
Children will supplant the text
*/
export default class RoundedButton extends React.Component {
  static PropTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    width: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    height: PropTypes.string,
  }

  renderContent() {
    const {text, children, type} = this.props
    if (children) return children
    else return (<Text type={type}>{text}</Text>)
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
