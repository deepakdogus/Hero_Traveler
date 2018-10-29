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
import { FollowButtonStyle } from '../FollowFollowingRow'

const LimitedWidthRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-self: center;
  width: 700px;
`

const NarrowCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  height: 215px;
`

const About = styled(Name)`
 font-style: normal;
 color: ${props => props.theme.Colors.grey};
`

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  margin: 0;
  font-weight: 600;
  font-size: 23px;
  color ${props => props.theme.Colors.background};
`

const CountLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.background};
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
`

const ClickRow = styled(Row)`
  cursor: pointer;
`

const SecondCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 430px;
`

const UserDetailsContainer = styled.div``

const BadgeContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
`

const ClickableIcon = styled(Icon)`
  cursor: pointer;
`

const EditButtonStyle = `
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 6px;
`

const StyledButton = styled.div`
  text-align: left;
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

  _renderUserBadge = () => {
    const roleType = this.props.user.role === 'contributor'
    ? {
      badgeType: 'profileBadge',
      text: 'CONTRIBUTOR',
    } : {
      badgeType: 'founderBadge',
      text: 'FOUNDING MEMBER',
    }

    return (
      <BadgeContainer>
        <ClickRow onClick={this.props.openContributor}>
          <ClickableIcon name={roleType.badgeType}/>
          <BottomLeftText>{roleType.text}</BottomLeftText>
        </ClickRow>
      </BadgeContainer>
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
          <NarrowCol>
            <StyledAvatar
              avatarUrl={getImageUrl(user.profile.avatar, 'avatarLarge')}
              type='profile'
              size='x-large'
            />
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
          <SecondCol>
            <UserDetailsContainer>
              <Username>{user.username}</Username>
              <Name>{user.profile.fullName}</Name>
              <About>{user.about}</About>
              <BioText onClick={openBio}>Read Bio</BioText>
            </UserDetailsContainer>
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
                  textProps={FollowButtonStyle}
                />
              }
            </StyledButton>
          </SecondCol>
        </LimitedWidthRow>
        { hasBadge && this._renderUserBadge()}
      </Centered>
    )
  }
}
