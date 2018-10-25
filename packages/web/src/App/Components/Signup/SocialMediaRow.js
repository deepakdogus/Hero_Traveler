import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'

function getMargin(props) {
  switch(props.margin) {
    case 'modal':
      return '20px 0px'
    default:
      return '0 3%'
  }
}

const StyledIcon = styled(Icon)`
  height: 25px;
`

const FacebookIcon = styled(StyledIcon)`
  padding: 0 9px;
`

const TwitterIcon = styled(StyledIcon)`
  width: 30.5px;
`

const InstagramIcon = styled(StyledIcon)`
  width: 25px;
  padding: 0 2.5px;
`

const SocialMediaItemContainer = styled.div`
  position: relative;
  vertical-align: middle;
  margin: ${props => getMargin};
`

const StyledSpan = styled.span`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .2px;
  position: absolute;
  line-height: 30px;
  bottom: 0;
`

const RightSpan = styled(StyledSpan)`
  right: 0;
  color: ${props => props.isConnected ? props.theme.Colors.grey : props.theme.Colors.red}
`

const LeftSpan = styled(StyledSpan)`
  padding-left: 10px;
  color: ${props => props.theme.Colors.grey}
`

export default class SocialMediaRow extends Component {
   static propTypes = {
    iconName: PropTypes.string,
    text: PropTypes.string,
    isConnected: PropTypes.bool,
  }

  getIcon(text) {
    switch (text){
      case 'Facebook':
        return (<FacebookIcon name='facebook-blue-large' />)
      case 'Twitter':
        return (<TwitterIcon name='twitter-blue' />)
      case 'Instagram':
      default:
        return (<InstagramIcon name='instagram' />)
    }
  }

  render() {
    const {text, isConnected} = this.props
    return (
      <SocialMediaItemContainer {...this.props}>
        {this.getIcon(text)}
        <LeftSpan>{text}</LeftSpan>
        <RightSpan isConnected={isConnected}>{isConnected ? 'Connected' : 'Connect'}</RightSpan>
      </SocialMediaItemContainer>
    )
  }
}
