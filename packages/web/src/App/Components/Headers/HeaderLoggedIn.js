import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Row, Col } from '../FlexboxGrid'
import ProfileMenu from './ProfileMenu'
import { mediaMax, mediaMin } from '../ContentLayout.component'
import Avatar from '../Avatar'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import { StyledRow, StyledRoundedButton, Logo, Divider, HamburgerIcon, SearchNav } from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'
import NotificationsBadge from '../NotificationsBadge'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import ConditionalLink from '../ConditionalLink'

const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
`

const LoggedInTabletContainer = styled.div`
  ${mediaMin.desktop`display: none;`}
  ${mediaMax.phone`display: none;`}
`

const NotificationsIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  position: relative;
  top: ${props => props.profileAvatar ? '4px' : '3px'};
`

const StyledRoundedCreateButton = styled(RoundedButton)`
    position: relative;
    bottom: 7px;
`

const StyledRoundedNotificationButton = styled(StyledRoundedButton)`
    position: relative;
    bottom: 4px;
`

const NotificationButtonContainer = styled.div`
  margin: 0;
  padding: 0;
  position: relative;
  display: inline;
`

class HeaderLoggedIn extends React.Component {
  static propTypes = {
    reroute: PropTypes.func,
    openModal: PropTypes.func,
    user: PropTypes.object,
    pathname: PropTypes.string,
    openSaveEditsModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    attemptLogout: PropTypes.func,
    profileAvatar: PropTypes.object,

    activities: PropTypes.objectOf(PropTypes.object),
    activitiesById: PropTypes.arrayOf(PropTypes.string),
    haveFieldsChanged: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
  }

  state = {
    profileMenuIsOpen: false
  }

  toggleProfileMenu = () => {
    if (this.state.profileMenuIsOpen) return
    this.setState({profileMenuIsOpen: true})
  }

  closeProfileMenu = () => {
    if (this.state.profileMenuIsOpen) {
      setTimeout( () => {
        this.setState({profileMenuIsOpen: false})
      }, 100)
    }
  }

  _getNotificationsCount = () => {
    const {activities, activitiesById} = this.props
    let count = 0
    activitiesById.map(id => {
      if(!activities[id].seen) count++
    })
    return count
  }

  render () {
    const {
      openModal,
      openGlobalModal,
      userId,
      profileAvatar,
      pathname,
      reroute,
      attemptLogout,
      openSaveEditsModal,
      haveFieldsChanged,
      workingDraft,
      originalDraft,
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
          </ConditionalLink>
        </Col>
        <LoggedInDesktopContainer>
          <Col>
            <Row middle="xs">
              <ConditionalLink
                to='/feed/'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                My Feed
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <span>&nbsp;</span>
              <ConditionalLink
                to='/'
                pathname={pathname}
                openSaveEditsModal={openSaveEditsModal}
                isMenuLink={true}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
              >
                Explore
              </ConditionalLink>
            </Row>
          </Col>
        </LoggedInDesktopContainer>
        <Col smOffset={2} lg={5}>
          <Row end='xs' middle='xs'>
            <SearchNav
              pathname={pathname}
              openSaveEditsModal={openSaveEditsModal}
              isMenuLink={false}
              haveFieldsChanged={haveFieldsChanged}
              workingDraft={workingDraft}
              originalDraft={originalDraft}
            />
            <Divider>&nbsp;</Divider>
            <LoggedInDesktopContainer>
              {// we remove the 'Create' button from the HeaderLoggedIn Nav if we're editting a story
              !this.props.pathname.includes('editStory') &&
              <NavLink to='/editStory/new'>
                <StyledRoundedCreateButton text='Create'/>
              </NavLink>
              <NotificationButtonContainer>
                {this._getNotificationsCount() > 0
                && <NotificationsBadge
                  count={this._getNotificationsCount()}
                   />}
                <StyledRoundedNotificationButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  name='notifications'
                  onClick={openModal}
                >
                  <NotificationsIcon name='cameraFlash' />
                </StyledRoundedNotificationButton>
              </NotificationButtonContainer>

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
                    avatarUrl={getImageUrl(profileAvatar)}
                  />
                </StyledRoundedAvatarButton>
                  {this.state.profileMenuIsOpen &&
                    <ProfileMenu
                      closeMyself={this.closeProfileMenu}
                      openModal={openModal}
                      openGlobalModal={openGlobalModal}
                      userId={userId}
                      reroute={reroute}
                      attemptLogout={attemptLogout}
                      openSaveEditsModal={openSaveEditsModal}
                      pathname={pathname}
                      haveFieldsChanged={haveFieldsChanged}
                      workingDraft={workingDraft}
                      originalDraft={originalDraft}
                    />
                  }
            </LoggedInDesktopContainer>
            <LoggedInTabletContainer>
              <NavLink
                to='/editStory/new'
              >
                <StyledRoundedButton text='Create'/>
              </NavLink>
            </LoggedInTabletContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={openModal}
            />
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
    profileAvatar
  }
}

export default connect(mapStateToProps)(HeaderLoggedIn)
