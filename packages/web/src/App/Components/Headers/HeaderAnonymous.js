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
  SearchNav
} from './Shared'

export default class HeaderAnonymous extends React.Component {
  static propTypes = {
    openLoginModal: PropTypes.func,
    pathname: PropTypes.string,
    haveFieldsChanged: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
    openGlobalModal: PropTypes.func,
    reroute: PropTypes.func,
  }

  _openLoginModal = () => {
    this.props.openGlobalModal('login')
  }

  render () {
    const {
      haveFieldsChanged,
      workingDraft,
      originalDraft,
    } = this.props

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
              haveFieldsChanged={haveFieldsChanged}
              workingDraft={workingDraft}
              originalDraft={originalDraft}
            />
            <Divider>&nbsp;</Divider>
            <LoginLink
              onClick={this.props.openLoginModal}
            >Log In</LoginLink>
            <StyledRoundedLoginButton
              text='Login'
              onClick={this._openLoginModal}
            />
          </Row>
        </Col>
      </StyledRow>
    )
  }
}
