import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {
  Username,
  ItalicText,
  Centered,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
  BottomLeft,
  BottomLeftText,
  Container
} from './ProfileHeaderShared'
import NavLinkStyled from '../NavLinkStyled'


const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 400;
  font-size: 23px;
  color ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
`

const CountLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.lightGrey};
  letter-spacing: 1.5px;
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin: 0 20px;
`

const CountWrapper = styled(Row)`
  margin-top: 25px !important;
`

const CountItemWrapper = styled.div`
  cursor: pointer;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
`

const BioText = styled(ItalicText)`
  cursor: pointer;
`

const ClickRow = styled(Row)`
  cursor: pointer;
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
      <Container>
        <Centered>
          <Username>{user.username}</Username>
          <StyledHorizontalDivider />
          <ItalicText>{user.profile.fullName}</ItalicText>
          <AvatarWrapper>
            <StyledAvatar
              avatarUrl={getImageUrl(user.profile.avatar)}
              type='profile'
              size='x-large'
            />
          </AvatarWrapper>
          <BioText onClick={openBio}>Read Bio</BioText>
          <CountWrapper center='xs'>
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
          <ButtonWrapper>
            { isUsersProfile &&
              <NavLinkStyled to={`/profile/${user.id}/edit`}>
                <RoundedButton type='opaque' text='EDIT PROFILE'/>
              </NavLinkStyled>
            }
            {
              !isUsersProfile &&
              <div>
                <RoundedButton
                  margin='small'
                  onClick={isFollowing ? unfollowUser : followUser}
                  type={isFollowing ? 'opaqueWhite' : 'opaque'}
                  text={isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                />
                {
                // disabled until proper implementation
                // <RoundedButton
                //   margin='small'
                //   type='opaque'
                //   text='MESSAGE'/>
                }
              </div>
            }
          </ButtonWrapper>
        </Centered>
        <BottomLeft>
          {isContributor &&
            <ClickRow onClick={openContributor}>
              <Icon name='profileBadge'/>
              <BottomLeftText>CONTRIBUTOR</BottomLeftText>
            </ClickRow>
          }
        </BottomLeft>
      </Container>
    )
  }
}
