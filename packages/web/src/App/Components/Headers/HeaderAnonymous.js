import React from 'react'
import logo from '../../Shared/Images/ht-logo-white.png'
import { Row, Col } from '../FlexboxGrid'
import { StyledRow, StyledRoundedLoginButton, LoginLink, Logo, Divider, HamburgerIcon, SearchNav } from './Shared'

export default class LoggedInHeader extends React.Component {
  render () {
    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <Logo src={logo} alt={'Hero Traveler Logo'}/>
        </Col>
        <Col lg={5}>
        </Col>
        <Col>
          <Row around='xs' middle='xs'>
            <SearchNav />
            <Divider>&nbsp;</Divider>
            <LoginLink
                onClick={this.props.openLoginModal}
            >Log In</LoginLink>
            <StyledRoundedLoginButton
              text='Login'
                onClick={this.props.openLoginModal}
            />
            <HamburgerIcon
                name='hamburger'
            />
          </Row>
        </Col>
      </StyledRow>
    )
  }
}
