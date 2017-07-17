import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import HorizontalDivider from '../../Components/HorizontalDivider'

const StyledIcon = styled(Icon)`
	margin-left: 30px;
	height: 25px;
`

const FacebookIcon = styled(StyledIcon)`
	width: 12.5px;
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
`

const RightSpan = styled.span`
	position: absolute;
	right: 25px;
	line-height: 25px;
	bottom: 0;
	color: ${props => `${props.isConnected ? props.theme.Colors.signupGrey : props.theme.Colors.red}`}
`

const LeftSpan = styled.span`
	position: absolute;
	padding-left: 10px;
	line-height: 25px;
	bottom: 0;
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
  			return (<FacebookIcon name='facebook-blue' />)
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
			<SocialMediaItemContainer>
				{this.getIcon(text)}
				<LeftSpan>{text}</LeftSpan>
  			<RightSpan isConnected={isConnected}>{isConnected ? 'Connected' : 'Connect'}</RightSpan>
			</SocialMediaItemContainer>
    )
  }
}
