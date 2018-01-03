import React from 'react'
import onClickOutside from "react-onclickoutside"
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Sidebar = styled.div`
	position: absolute;
	right: 5px;
	background-color: ${props => props.theme.Colors.white};
	box-shadow: 3px 6px 5px -1px ${props => props.theme.Colors.background};
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
		isOpen: PropTypes.bool,
		closeMyself: PropTypes.func,
		openModal: PropTypes.func,
	}
	handleClickOutside = evt => {
		this.props.closeMyself()
	}
	render() {
		return (
			<Sidebar>
				<SidebarDemiLink>My Profile</SidebarDemiLink>
				<SidebarDemiLink onClick={(e) => this.props.openModal(e, "settings")}>Settings</SidebarDemiLink>
				<SidebarDemiLink>Customize Interests</SidebarDemiLink>
				<SidebarDemiLink>FAQ</SidebarDemiLink>
				<SidebarDemiLink>Logout</SidebarDemiLink>
			</Sidebar>
		)
	}
}

export default onClickOutside(ProfileMenu)
