import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import logo from '../../Shared/Images/ht-logo-white.png'
import { Link } from 'react-router-dom'
import { Col } from '../../Shared/Web/Components/FlexboxGrid'
import {
  StyledRow,
  StyledRoundedLoginButton,
  LoginLink,
  Logo,
  Divider,
  SearchNav,
} from '../../Shared/Web/Components/Headers/Shared'

const ItemsRow = styled(StyledRow)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-right: 20px;
  }
`

export default class HeaderAnonymous extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
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
      reroute,
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
          <ItemsRow around='xs' middle='xs'>
            <SearchNav
              to='/search'
              pathname={this.props.pathname}
              reroute={reroute}
              workingDraft={workingDraft}
              originalDraft={originalDraft}
            />
            <Divider>&nbsp;</Divider>
            <LoginLink onClick={this._openLoginModal}>
              Log In
            </LoginLink>
            <StyledRoundedLoginButton
              type='navbar'
              text='Login'
              onClick={this._openLoginModal}
            />
          </ItemsRow>
        </Col>
      </StyledRow>
    )
  }
}
