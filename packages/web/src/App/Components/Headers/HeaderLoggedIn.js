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
import {
  haveFieldsChanged
} from '../../Shared/Lib/draftChangedHelpers'

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
  cursor: pointer;
`

const StyledRoundedAvatarButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  position: relative;
  top: ${props => props.profileAvatar ? '4px' : '2.5px'};
`

const StyledRoundedCreateButton = styled(RoundedButton)`
  position: relative;
  bottom: ${props => props.profileAvatar ? '7px' : '2px'};
`

const StyledCreateButtonContainer = styled.div`
  margin: 10px 25px;
  position: relative;
  display: inline;
`

const StyledRoundedNotificationButton = styled(StyledRoundedButton)`
  position: relative;
  bottom: ${props => props.profileAvatar ? '5px' : '-1.8px'};
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
    globalModal: PropTypes.string,
    globalModalParams: PropTypes.object,
    closeGlobalModal: PropTypes.func,
    activities: PropTypes.objectOf(PropTypes.object),
    activitiesById: PropTypes.arrayOf(PropTypes.string),
    haveFieldsChanged: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
  }

  componentDidMount(){
    this.props.closeGlobalModal()
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
      globalModal,
      globalModalParams,
      workingDraft,
      originalDraft,
      openSaveEditsModal,
    } = this.props

    const notificationsCount = this._getNotificationsCount()

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
              {!this.props.pathname.includes('editStory') &&
                // we remove the 'Create' button from the HeaderLoggedIn Nav if we're editting a story
                <StyledCreateButtonContainer>
                  <NavLink to='/editStory/new'>
                    <StyledRoundedCreateButton
                      text='Create'
                      profileAvatar={profileAvatar}
                      margin='none' 
                    />
                  </NavLink>
                </StyledCreateButtonContainer>
              }
              <NotificationButtonContainer>
                {notificationsCount > 0 &&
                  <NotificationsBadge
                    count={notificationsCount}
                   />
                }
                <StyledRoundedNotificationButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  name='notifications'
                  profileAvatar={profileAvatar}
                  onClick={openModal}
                >
                  <NotificationsIcon name='navNotifications' />
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
                  {globalModal === 'profileMenu' &&
                    <ProfileMenu
                      closeMyself={this.closeProfileMenu}
                      openGlobalModal={openGlobalModal}
                      userId={userId}
                      reroute={reroute}
                      attemptLogout={attemptLogout}
                      globalModalParams={globalModalParams}
                      haveFieldsChanged={haveFieldsChanged}
                      workingDraft={workingDraft}
                      originalDraft={originalDraft}
                      openSaveEditsModal={openSaveEditsModal}
                      pathname={pathname}
                    />
                  }
            </LoggedInDesktopContainer>
            <LoggedInTabletContainer>
              <StyledCreateButtonContainer>
                <NavLink
                  to='/editStory/new'
                >
                  <RoundedButton 
                    text='Create'
                    margin='none' 
                  />
                </NavLink>
              </StyledCreateButtonContainer>
            </LoggedInTabletContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={this._openHamburgerMenu}
            />
            {globalModal === 'hamburgerMenu' &&
              <ProfileMenu
                closeMyself={this.closeProfileMenu}
                openGlobalModal={openGlobalModal}
                userId={userId}
                reroute={reroute}
                attemptLogout={attemptLogout}
                globalModalParams={globalModalParams}
                haveFieldsChanged={haveFieldsChanged}
                workingDraft={workingDraft}
                originalDraft={originalDraft}
                openSaveEditsModal={openSaveEditsModal}
                pathname={pathname}
              />
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
