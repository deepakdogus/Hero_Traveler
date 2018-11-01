import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Row, Col } from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {
  Username,
  Name,
  Centered,
  StyledAvatar,
  BottomLeftText,
} from './ProfileHeaderShared'
import { NavLinkStyled } from '../NavLinkStyled'
import {
  FollowButtonTextStyle,
  FollowButtonResponsiveTextStyle,
} from '../FollowFollowingRow'

const LimitedWidthRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-self: center;
  width: 700px;
  flex-wrap: nowrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100%;
  }
`

const BottomRow = styled(LimitedWidthRow)`
  height: 70px;
  align-items: flex-end;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: auto;
    padding-bottom: 20px;
  }
`

const NarrowCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    align-items: flex-start;
  }
`

const ImageCol = styled(NarrowCol)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-right: 20px;
    width: 100px;
  }
`

const About = styled(Name)`
  font-style: normal;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 13px;
  }
`

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  margin: 0;
  font-weight: 600;
  font-size: 23px;
  color ${props => props.theme.Colors.background};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
  }
`

const CountLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.background};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 10px;
  }
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.grey};
  margin: 0 20px;
`

const CountWrapper = styled(Row)`
  margin-top: 0px;
  justify-content: center;
  text-align: left;
  flex-wrap: nowrap;
`

const CountItemWrapper = styled.div`
  cursor: pointer;
`

const BioText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro}};
  font-style: normal;
  font-weight: 400;
  letter-spacing: .2px;
  text-align: left;
  font-size: 16px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  margin: 10px 0 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
    font-weight: 600;
    margin: 4px 0 0;
  }
`

const ClickRow = styled(Row)`
  cursor: pointer;
  align-items: center;
`

const SecondCol = styled(Col)`
  display: flex;
  flex-direction: column;
  width: 430px;
`

const ResponsiveCol = styled(SecondCol)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    align-items: flex-end;
    display: ${props => props.isUsersProfile ? 'none' : 'flex' }
  }
`

const UserDetailsContainer = styled.div``

const AbsoluteBadgeContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const FlexBadgeContainer = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
    align-self: flex-start;
    margin: 5px 0;
  }
`

const AbsoluteEditButtonContainer = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
    position: absolute;
    right: 5px;
    top: 20px;
  }
`

const Spacer = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 35px;
  }
`

const ClickableIcon = styled(Icon)`
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 20px;
    height: 20px;
  }
`

const PencilIcon = styled(Icon)``

const EditButtonStyle = `
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 6px;
`

const StyledButton = styled.div`
  text-align: left;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    align-items: flex-end;
  }
`

const AvatarResponsiveStyle = `
  width: 100px;
  height: 100px;
`

export default class ProfileHeaderView extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isFollowing: PropTypes.bool,
    isUsersProfile: PropTypes.bool,
    openBio: PropTypes.func,
    openContributor: PropTypes.func,
    openFollowedBy: PropTypes.func,
    openFollowing: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
    }
  }

  _renderUserBadge = (type = 'flexItem') => {
    const roleType = this.props.user.role === 'contributor'
    ? {
      badgeType: 'profileBadge',
      text: 'CONTRIBUTOR',
    } : {
      badgeType: 'founderBadge',
      text: 'FOUNDING MEMBER',
    }

    const BadgeContainer =
      type === 'absolute'
        ? AbsoluteBadgeContainer
        : FlexBadgeContainer

    return (
      <BadgeContainer>
        <ClickRow onClick={this.props.openContributor}>
          <ClickableIcon name={roleType.badgeType} />
          <BottomLeftText>{roleType.text}</BottomLeftText>
        </ClickRow>
      </BadgeContainer>
    )
  }

  _renderEditIcon = () => {
    const { user } = this.props
    return (
      <AbsoluteEditButtonContainer>
        <NavLinkStyled to={`/profile/${user.id}/edit`}>
          <PencilIcon
            name='pencilBlack'
          />
        </NavLinkStyled>
      </AbsoluteEditButtonContainer>
    )
  }

  render () {
    const {
      user,
      isUsersProfile,
      isFollowing,
      openBio,
      openFollowedBy,
      openFollowing,
      followUser,
      unfollowUser,
    } = this.props

    const hasBadge = user.role === 'contributor' || user.role === 'founding member'

    return (
      <Centered>
        <LimitedWidthRow center='xs'>
          <ImageCol>
            <StyledAvatar
              avatarUrl={getImageUrl(user.profile.avatar, 'avatarLarge')}
              type='profile'
              size='x-large'
              responsiveProps={AvatarResponsiveStyle}
            />
          </ImageCol>
          <SecondCol>
            <UserDetailsContainer>
              <Username>{user.username}</Username>
              <Name>{user.profile.fullName}</Name>
              <About>{user.about}</About>
              <BioText onClick={openBio}>Read Bio</BioText>
            </UserDetailsContainer>
          </SecondCol>
        </LimitedWidthRow>
        <LimitedWidthRow>
          { hasBadge
            ? this._renderUserBadge()
            : <Spacer />
          }
        </LimitedWidthRow>
        <BottomRow center='xs'>
          <NarrowCol>
            <CountWrapper>
                <CountItemWrapper onClick={openFollowedBy}>
                  <Count>{user.counts.followers}</Count>
                  <CountLabel>Followers</CountLabel>
                </CountItemWrapper>
                <Divider/>
                <CountItemWrapper onClick={openFollowing}>
                  <Count>{user.counts.following}</Count>
                  <CountLabel>Following</CountLabel>
                </CountItemWrapper>
              </CountWrapper>
          </NarrowCol>
          <ResponsiveCol
            isUsersProfile={isUsersProfile}
          >
            <StyledButton>
              { isUsersProfile &&
                <NavLinkStyled to={`/profile/${user.id}/edit`}>
                  <RoundedButton
                    type='blackWhite'
                    text='EDIT PROFILE'
                    margin='none'
                    textProps={EditButtonStyle}
                  />
                </NavLinkStyled>
              }
              { !isUsersProfile &&
                <RoundedButton
                  onClick={isFollowing ? unfollowUser : followUser}
                  type={isFollowing ? '' : 'blackWhite'}
                  text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                  margin='none'
                  textProps={FollowButtonTextStyle}
                  responsiveTextProps={FollowButtonResponsiveTextStyle}
                />
              }
            </StyledButton>
          </ResponsiveCol>
        </BottomRow>
        { hasBadge && this._renderUserBadge('absolute') }
        { isUsersProfile && this._renderEditIcon() }
      </Centered>
    )
  }
}
