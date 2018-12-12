import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WrappedNavLink } from '../../Components/NavLinkStyled'
import {
  Row,
  Col,
} from '../FlexboxGrid'
import ProfileMenu from './ProfileMenu'
import { mediaMax } from '../ContentLayout.component'
import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import {
  StyledRow,
  Logo,
  Divider,
  HamburgerIcon,
} from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import ConditionalLink from '../ConditionalLink'
import { haveFieldsChanged } from '../../Shared/Lib/draftChangedHelpers'

const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
`

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  position: relative;
  top: ${props => props.profileAvatar ? '4px' : '2.5px'};
`

const CMSSpan = styled.span`
	color: white;
	padding-left: 20px;
	font-weight: bold;
	position: absolute;
	top: 25px;
	text-decoration: none;
`

class HeaderLoggedIn extends React.Component {
  static propTypes = {
    reroute: PropTypes.func,
    user: PropTypes.object,
    pathname: PropTypes.string,
    openSaveEditsModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    attemptLogout: PropTypes.func,
    profileAvatar: PropTypes.object,
    globalModal: PropTypes.string,
    globalModalParams: PropTypes.object,
    closeGlobalModal: PropTypes.func,
    activities: PropTypes.objectOf(PropTypes.object),
    activitiesById: PropTypes.arrayOf(PropTypes.string),
    haveFieldsChanged: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
  }

  toggleProfileMenu = () => {
    if (
      this.props.globalModal === 'profileMenu'
      || this.props.globalModal === 'hamburgerMenu'
    ) return
    else{
      this.props.openGlobalModal('profileMenu')
    }
  }

  closeProfileMenu = () => {
    setTimeout(() => {
      if(
        this.props.globalModal === 'profileMenu'
        || this.props.globalModal === 'hamburgerMenu'
      ) {
          this.props.closeGlobalModal()
      }
    }, 100)
  }

  _openHamburgerMenu = () => {
    this.props.openGlobalModal('hamburgerMenu', {isHamburger: true})
  }

  renderProfileMenu = () => {
    const {
      userId,
      reroute,
      attemptLogout,
      globalModalParams,
    } = this.props

    return (
      <ProfileMenu
        closeMyself={this.closeProfileMenu}
        userId={userId}
        reroute={reroute}
        attemptLogout={attemptLogout}
        globalModalParams={globalModalParams}
      />
    )
  }

  render () {
    const {
      profileAvatar,
      pathname,
      globalModal,
      workingDraft,
      originalDraft,
      openSaveEditsModal,
    } = this.props

    return (
      <StyledRow between="xs" middle="xs">
        <Col>
          <ConditionalLink
            to="/"
            pathname={pathname}
            openSaveEditsModal={openSaveEditsModal}
            isMenuLink={false}
            haveFieldsChanged={haveFieldsChanged}
            workingDraft={workingDraft}
            originalDraft={originalDraft}
          >
            <Logo src={logo} alt={'Hero Traveler Logo'}/>
            <CMSSpan>CMS</CMSSpan>
          </ConditionalLink>
        </Col>
        <LoggedInDesktopContainer>
          <Col>
            <Row middle="xs">
              <ConditionalLink
                to='/'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Home
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <ConditionalLink
                to='/users'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Users
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <ConditionalLink
                to='/categories'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Categories
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <ConditionalLink
                to='/stories'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Stories
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <ConditionalLink
                to='/discover'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Discover
              </ConditionalLink>
            </Row>
          </Col>
        </LoggedInDesktopContainer>
        <Col>
          <Row end='xs' middle='xs'>
            <LoggedInDesktopContainer>
              <StyledRoundedAvatarButton
                type='headerButton'
                height='32px'
                width='32px'
                profileAvatar={profileAvatar}
                onClick={this.toggleProfileMenu}
              >
                <Avatar
                  type='avatar'
                  size={profileAvatar ? 'avatar' : 'mediumSmall'}
                  avatarUrl={getImageUrl(profileAvatar, 'avatar')}
                  isProfileHeader={true}
                />
              </StyledRoundedAvatarButton>
                {globalModal === 'profileMenu' &&
                  this.renderProfileMenu()
                }
            </LoggedInDesktopContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={this._openHamburgerMenu}
            />
            {globalModal === 'hamburgerMenu' &&
              this.renderProfileMenu()
            }
          </Row>
        </Col>
      </StyledRow>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {users} = state.entities
  let profileAvatar = _.get(users, `entities[${ownProps.userId}].profile.avatar`)
  return {
    profileAvatar,
    globalModal: state.ux.modalName,
    globalModalParams: state.ux.params,
  }
}

export default connect(mapStateToProps)(HeaderLoggedIn)
