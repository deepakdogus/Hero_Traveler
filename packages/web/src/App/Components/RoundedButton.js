import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledButton = styled.button`
	height: 40px;
	border-radius: 30px;
	border: 1px solid;
	border-color: ${props => {
		switch(props.type) {
			case 'opaque':
				return `${props.theme.Colors.snow}`
			default:
				return `${props.theme.Colors.red}`
		}
	}};
	margin: ${(props) => `${props.theme.Metrics.baseMargin}px ${props.theme.Metrics.section}px`};
	background-color: ${props => {
		switch(props.type) {
			case 'opaque':
				return `${props.theme.Colors.windowTint}`
			default:
				return `${props.theme.Colors.red}`
		}
	}};
`
const Text = styled.p`
	color: ${props => `${props.theme.Colors.snow}`};
	text-align: center;
	font-size: ${props => `${props.theme.Fonts.size.medium}px`};
	padding: 0 10px;
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
		const {text, children} = this.props
		if (children) return children
		else return (<Text>{text}</Text>)
	}

	render() {
		const {onclick, type} = this.props
		return (
			<StyledButton type={type} onclick={onclick}>
				{this.renderContent()}
			</StyledButton>
		)
	}
}