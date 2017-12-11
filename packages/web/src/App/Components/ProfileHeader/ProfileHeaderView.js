import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Row, Col} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {
  Username,
  Name,
  Centered,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
  BottomLeft,
  BottomLeftText,
} from './ProfileHeaderShared'
import NavLinkStyled from '../NavLinkStyled'
import VerticalCenter from '../VerticalCenter'

const LimitedWidthRow = styled(Row)`
  align-self: center;
  width: 650px;
`

const NarrowCol = styled(Col)`
  width: 200px;
`

const About = styled(Name)`
 font-style: normal;
 color: ${props => props.theme.Colors.grey};
 width: 430px;
`

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 600;
  font-size: 23px;
  color ${props => props.theme.Colors.background};
`

const CountLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 600;
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
  text-align: left;
`

const CountItemWrapper = styled.div`
  cursor: pointer;
`

const BioText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro}};
  font-style: normal;
  font-weight: 400;
  letter-spacing: .5px;
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
  margin-left: 20px;
  width: 430px;
`

const Spacer = styled.div`
  height: 15px;
`

export default class ProfileHeaderView extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
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

  render () {
    const {
      user,
      isContributor, isUsersProfile, isFollowing,
      openBio, openContributor,
      openFollowedBy, openFollowing,
      followUser, unfollowUser,
    } = this.props

    return (
      <Centered>
        <LimitedWidthRow center='xs'>
          <NarrowCol>
            <AvatarWrapper>
              <StyledAvatar
                avatarUrl={getImageUrl(user.profile.avatar)}
                type='profile'
                size='x-large'
              />
            </AvatarWrapper>
          </NarrowCol>
          <SecondCol>
            <Username>{user.username}</Username>
            <Name>{user.profile.fullName}</Name>
            <About>{user.about}</About>
            <BioText onClick={openBio}>Read Bio</BioText>
          </SecondCol>
        </LimitedWidthRow>
        <Spacer/>
        <LimitedWidthRow center='xs'>
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
          <SecondCol>
            <VerticalCenter>
            <ButtonWrapper>
              { isUsersProfile &&
                <NavLinkStyled to={`/profile/${user.id}/edit`}>
                  <RoundedButton
                    margin='none'
                    type='blackWhite'
                    text='EDIT PROFILE'
                  />
                </NavLinkStyled>
              }
              { !isUsersProfile &&
                <RoundedButton
                  margin='none'
                  onClick={isFollowing ? unfollowUser : followUser}
                  type={isFollowing ? 'blackWhite' : ''}
                  text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                />
              }
            </ButtonWrapper>
            </VerticalCenter>
          </SecondCol>
        </LimitedWidthRow>
        { isContributor &&
        <BottomLeft>
            <ClickRow onClick={openContributor}>
              <Icon name='profileBadge'/>
              <BottomLeftText>CONTRIBUTOR</BottomLeftText>
            </ClickRow>
        </BottomLeft>
        }
      </Centered>
    )
  }
}
