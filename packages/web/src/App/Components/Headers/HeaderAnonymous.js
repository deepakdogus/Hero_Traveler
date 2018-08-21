import React from 'react'
import PropTypes from 'prop-types'
import logo from '../../Shared/Images/ht-logo-white.png'
import { Link } from 'react-router-dom'
import { Row, Col } from '../FlexboxGrid'
import {
  StyledRow,
  StyledRoundedLoginButton,
  LoginLink,
  Logo,
  Divider,
  HamburgerIcon,
  SearchNav
} from './Shared'

export default class HeaderAnonymous extends React.Component {
  static propTypes = {
    openLoginModal: PropTypes.func,
    pathname: PropTypes.string,
  }

  render () {
    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <Link to="/">
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
          </Link>
        </Col>
        <Col lg={5}>
        </Col>
        <Col>
          <Row around='xs' middle='xs'>
            <SearchNav
              to='/search'
              pathname={this.props.pathname}
            />
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
