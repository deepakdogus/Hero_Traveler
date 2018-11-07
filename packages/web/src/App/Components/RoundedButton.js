import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import VerticalCenter from './VerticalCenter'

function getMargin(props) {
  if (props.margin === 'none') return 0
  else if (props.margin === 'small') return '3px'
  else if (props.margin === 'medium') return '11px'
  else if (props.margin === 'vertical') return '5px 0'
  else if (props.margin === 'noRight') {
    const vertical = props.theme.Metrics.baseMargin
    const left = props.theme.Metrics.section
    return `${vertical}px 0 ${vertical}px ${left}px`
  }
  return `${props.theme.Metrics.baseMargin}px ${props.theme.Metrics.section}px`
}

// 2px 6px 3px is default react padding.
function getPadding(props) {
  if (props.padding === 'smallEven') return '2px'
  if (props.padding === 'even') return '5px'
  if (props.padding === 'evenMedium') return '11px'
  if (props.padding === 'mediumEven') return '8px'
  if (props.padding === 'medium') return '4px 8px 5px'
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
    case 'categoryFollow':
    case 'exploreCategoryFollow':
      return colors.redLight
    case 'blackWhite':
    case 'facebook':
    case 'twitter':
    case 'lightGrey':
    case 'opaqueGrey':
      return colors.snow
    case 'headerButton':
    case 'backgroundOpaque':
      return colors.backgroundOpaque
    default:
      return colors.redHighlights
  }
}

function getHoverColorAndBorder (type, colors) {
  switch(type) {
    case 'grey':
      return [colors.btnDarkGreyBackground, colors.btnDarkGreyBackground]
    case 'blackWhite':
      return [colors.lightGreyAreas, colors.photoOverlay]
    case 'headerButton':
      return ['transparent', colors.navBarText]
    case 'myFeedHeaderButton':
    case 'opaque':
      return [colors.windowTint, colors.snow]
    case 'opaqueWhite':
      return [colors.whiteAlphaPt4, colors.snow]
    case 'facebook':
    case 'facebookSignup':
      return [colors.facebookHover, colors.facebookHover]
    case 'twitter':
    case 'twitterSignup':
      return [colors.twitterBlueHover, colors.twitterBlueHover]
    case 'opaqueGrey':
      return [colors.greyHover, colors.greyHover]
    case 'lightGrey':
      return [colors.signupGreyHover, colors.signupGreyHover]
    case 'exploreCategoryFollow':
    case 'categoryFollow':
    case 'backgroundOpaque':
    default:
      return [colors.onHoverRed, colors.onHoverRed]
  }
}

const StyledButton = styled.button`
  cursor: pointer;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  letter-spacing: .6px;
  height: ${props => props.height || 'auto'};
  border-radius: 30px;
  outline: none;
  border: 1px solid;
  outline: none;
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
      case 'categoryFollow':
      case 'myFeedHeaderButton':
        return props.theme.Colors.snow
      case 'blackWhite':
        return props.theme.Colors.photoOverlay
      case 'headerButton':
        return props.theme.Colors.navBarText
      case 'opaqueGrey':
        return props.theme.Colors.grey
      case 'backgroundOpaque':
        return props.theme.Colors.closeXBorder
      case 'exploreCategoryFollow':
      default:
        return props.theme.Colors.redHighlights
    }
  }};
  margin: ${props => getMargin};
  padding: ${props => getPadding};
  background-color: ${props => getBackgroundColor(props.type, props.theme.Colors)};
  width: ${props => props.width || 'inherit'};
  &:hover {
    background:  ${props => getHoverColorAndBorder(props.type, props.theme.Colors)[0]};
    border-color:  ${props => getHoverColorAndBorder(props.type, props.theme.Colors)[1]};
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveButtonProps}
  }
`
const Text = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => {
    switch(props.type) {
      case 'blackWhite':
        return props.theme.Colors.photoOverlay
      default:
        return props.theme.Colors.snow
    }
  }};
  text-align: center;
  font-size: ${props => {
    switch(props.type) {
      case 'navbar':
        return '15px'
      default:
        return '16px'
    }
  }};
  margin: ${props => `${props.type === 'navbar' ? '3.5' : '2.5'}px 10px`};
  letter-spacing: .6px;
  white-space: nowrap;
  ${props => props.textProps}
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    ${props => props.responsiveTextProps}
  }
`

/*
Can provide RoundedButton with either straight text or children
Children will supplant the text
*/
export default class RoundedButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.string,
    width: PropTypes.string,
    margin: PropTypes.string,
    padding: PropTypes.string,
    height: PropTypes.string,
    textProps: PropTypes.string,
    responsiveTextProps: PropTypes.string,
  }

  renderContent() {
    const {text, children, type, textProps, responsiveTextProps} = this.props
    let RenderText = Text

    if (children) return children
    else return (
      <RenderText
        type={type}
        textProps={textProps}
        responsiveTextProps={responsiveTextProps}
      >
        {text}
      </RenderText>
    )
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
