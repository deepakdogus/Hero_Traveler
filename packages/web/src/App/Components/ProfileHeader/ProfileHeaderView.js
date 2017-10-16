import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {
  Username,
  ItalicText,
  Centered,
  StyledHorizontalDivider,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
  BottomLeft,
  ContributorText,
  Container
} from './ProfileHeaderShared'
import NavLinkStyled from '../NavLinkStyled'


export const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 400;
  font-size: 23px;
  color ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
`

export const CountLabel = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.lightGrey};
  letter-spacing: 1.5px;
`

export const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin: 0 20px;
`

export const CountWrapper = styled(Row)`
  margin-top: 25px !important;
`

export const CountItemWrapper = styled.div``

export default class ProfileHeaderView extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
    }
  }

  render () {
    const {user, isContributor} = this.props
    const isUsersProfile = user.id === '59d64ca84722340010b12c98'
    const isFollowing = user.id === '59d508c56ed1d9001008780b'
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
          <ItalicText>Read Bio</ItalicText>
          <CountWrapper center='xs'>
            <CountItemWrapper>
              <Count>{user.counts.followers}</Count>
              <CountLabel>Followers</CountLabel>
            </CountItemWrapper>
            <Divider/>
            <CountItemWrapper>
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
                  onClick={this.openFollowedByModal}
                  type={isFollowing ? 'opaqueWhite' : 'opaque'}
                  text={isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                />
                <RoundedButton
                  margin='small'
                  type='opaque'
                  text='MESSAGE'/>
              </div>
            }
          </ButtonWrapper>
        </Centered>
        <BottomLeft>
          {isContributor &&
            <Row>
              <Icon name='profileBadge'/>
              <ContributorText>CONTRIBUTOR</ContributorText>
            </Row>
          }
        </BottomLeft>
      </Container>
    )
  }
}
