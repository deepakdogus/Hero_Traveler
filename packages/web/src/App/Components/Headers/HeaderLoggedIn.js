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
import Icon from '../Icon'
import {
  StyledRow,
  StyledRoundedButton,
  Logo,
  Divider,
  HamburgerIcon,
  SearchNav,
} from './Shared'
import logo from '../../Shared/Images/ht-logo-white.png'
import NotificationsBadge from '../NotificationsBadge'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import ConditionalLink from '../ConditionalLink'

const LoggedInDesktopContainer = styled.div`
  ${mediaMax.desktop`display: none;`}
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

const CreateButtonStyleOverride = {
  position: 'relative',
  display: 'inline',
}

const AvatarImageTextStyles = `
  right: 6px;
  bottom: 2px;
`

const AvatarIconTextStyles = `
  bottom: 1px;
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
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
    pendingMediaUploads: PropTypes.number,
  }

  componentDidMount() {
    this.props.closeGlobalModal()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId && !nextProps.userId) this.props.closeGlobalModal()
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

    return activitiesById.reduce((count , id) => {
      if (!activities[id].seen) return count + 1
      else return count
    }, 0)
  }

  openNotifications = () => {
    this.props.openGlobalModal('notificationsThread')
  }

  renderProfileMenu = () => {
    const {
      openGlobalModal,
      userId,
      pathname,
      reroute,
      attemptLogout,
      globalModalParams,
      workingDraft,
      originalDraft,
      openSaveEditsModal,
    } = this.props

    return (
      <ProfileMenu
        closeMyself={this.closeProfileMenu}
        openGlobalModal={openGlobalModal}
        userId={userId}
        reroute={reroute}
        attemptLogout={attemptLogout}
        globalModalParams={globalModalParams}
        workingDraft={workingDraft}
        originalDraft={originalDraft}
        openSaveEditsModal={openSaveEditsModal}
        pathname={pathname}
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
      reroute,
      pendingMediaUploads,
    } = this.props

    const notificationsCount = this._getNotificationsCount()
    const conditionalLinkParams = {
      pathname,
      openSaveEditsModal,
      reroute,
      workingDraft,
      originalDraft,
      pendingMediaUploads,
    }

    return (
      <StyledRow
        between="xs"
        middle="xs"
      >
        <Col>
          <ConditionalLink
            to="/"
            isMenuLink={false}
            {...conditionalLinkParams}
          >
            <Logo
              src={logo}
              alt={'Hero Traveler Logo'}
            />
          </ConditionalLink>
        </Col>
        <LoggedInDesktopContainer>
          <Col>
            <Row middle="xs">
              <ConditionalLink
                to='/feed/'
                isMenuLink={true}
                {...conditionalLinkParams}
              >
                My Feed
              </ConditionalLink>
              <Divider>&nbsp;</Divider>
              <ConditionalLink
                to='/'
                isMenuLink={true}
                {...conditionalLinkParams}
              >
                Explore
              </ConditionalLink>
            </Row>
          </Col>
        </LoggedInDesktopContainer>
        <Col
          smOffset={2}
          lg={5}
        >
          <Row
            end='xs'
            middle='xs'
          >
            <SearchNav
              isMenuLink={false}
              {...conditionalLinkParams}
            />
            <Divider>&nbsp;</Divider>
            <LoggedInDesktopContainer>
              {!this.props.pathname.includes('editStory') && (
                // we remove the 'Create' button from the HeaderLoggedIn Nav if we're editting a story
                <WrappedNavLink
                  to='/editStory/new'
                  styles={CreateButtonStyleOverride}
                >
                  <StyledRoundedCreateButton
                    text='Create'
                    type='navbar'
                    profileAvatar={profileAvatar}
                    margin='none'
                  />
                </WrappedNavLink>
              )}
              <NotificationButtonContainer>
                {notificationsCount > 0 && (
                  <NotificationsBadge
                    count={notificationsCount}
                    onClick={this.openNotifications}
                  />
                )}
                <StyledRoundedNotificationButton
                  type='headerButton'
                  height='32px'
                  width='32px'
                  name='notifications'
                  profileAvatar={profileAvatar}
                  onClick={this.openNotifications}
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
                    avatarUrl={getImageUrl(profileAvatar, 'avatar')}
                    iconTextProps={AvatarIconTextStyles}
                    imageTextProps={AvatarImageTextStyles}
                  />
                </StyledRoundedAvatarButton>
                  {globalModal === 'profileMenu' && (
                    this.renderProfileMenu()
                  )}
            </LoggedInDesktopContainer>
            <HamburgerIcon
              name='hamburger'
              onClick={this._openHamburgerMenu}
            />
            {globalModal === 'hamburgerMenu' && (
              this.renderProfileMenu()
            )}
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
    globalModal: state.ux.modalName,
    globalModalParams: state.ux.params,
    pendingMediaUploads: state.storyCreate.pendingMediaUploads,
    profileAvatar,
  }
}

export default connect(mapStateToProps)(HeaderLoggedIn)
