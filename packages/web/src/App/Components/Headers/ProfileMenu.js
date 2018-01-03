import React from 'react'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Sidebar = styled.div`
	position: absolute;
	right: 5px;
	top: 70px;
	background-color: ${props => props.theme.Colors.white};
	box-shadow: 3px 3px 5px -1px ${props => props.theme.Colors.background};
	padding: 20px 0px 20px 40px;
`
const SidebarDemiLink = styled.p`
	font-family: ${props => props.theme.Fonts.type.sourceSansPro};
	color: ${props => props.theme.Colors.background};
	font-weight: 400;
	letter-spacing: .7px;
	font-size: 16px;
	max-width: 80%;
	text-align: start;
	cursor: pointer;
`

class ProfileMenu extends React.Component {
	static propTypes = {
		reroute: PropTypes.func,
		isOpen: PropTypes.bool,
		closeMyself: PropTypes.func,
		openModal: PropTypes.func,
		openGlobalModal: PropTypes.func,
		user: PropTypes.string,
	}
	handleClickOutside = evt => {
		this.props.closeMyself()
	}

	rerouteAndClose = (routePath) => {
		this.props.closeMyself()
		this.props.reroute(routePath)
	}
	openGlobalModalAndClose = (modalName) => {
		this.props.closeMyself()
		this.props.openGlobalModal(modalName)
	}
	render() {
		const  { user } = this.props
		console.log('PROPS', this.props)
		return (
			<Sidebar>
				<SidebarDemiLink onClick={() => this.rerouteAndClose(`/profile/${user}/view`)}>My Profile</SidebarDemiLink> 
				<SidebarDemiLink onClick={() => this.openGlobalModalAndClose('settings')}>Settings</SidebarDemiLink>
				<SidebarDemiLink onClick={() => this.rerouteAndClose('/signup/topics')}>Customize Interests</SidebarDemiLink>
				<SidebarDemiLink onClick={() => this.openGlobalModalAndClose('faqTermsAndConditions')}>FAQ</SidebarDemiLink>
				<SidebarDemiLink>Logout</SidebarDemiLink>
			</Sidebar>
		)
	}
}

export default onClickOutside(ProfileMenu)
