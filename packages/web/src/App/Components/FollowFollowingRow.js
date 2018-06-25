import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import RoundedButton from './RoundedButton'
import NavLink from './NavLinkStyled'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 90%;
  padding-left: 25px;
`

const UserName = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 0;
`

const ProfileDetail = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

// For SignupSocial we want to disable navigation to Profile
const ConditionalNavLink = (props) => {
  if (!props.onClick) return <div {...props}/>
  return ( <NavLink {...props} /> )
}

export default class FollowFollowingRow extends Component {
  static propTypes = {
    isFollowing: PropTypes.bool,
    isYou: PropTypes.bool,
    user: PropTypes.object,
    type: PropTypes.oneOf(['count', 'follow']),
    margin: PropTypes.string,
    onFollowClick: PropTypes.func,
    onProfileClick: PropTypes.func,
  }

  renderImage = () => {
    const {onProfileClick, user} = this.props
    return (
      <ConditionalNavLink
        to={`/profile/${user.id}/view`}
        onClick={onProfileClick}
      >
        <Avatar
          avatarUrl={getImageUrl(user.profile.avatar)}
          size='larger'
        />
      </ConditionalNavLink>
    )
  }

  renderText = () => {
    const {user, onProfileClick, type} = this.props
    const detailsText = type === 'count' ? `${user.counts.followers} followers` : 'Lorum Ipsum'
    return (
      <StyledVerticalCenter>
        <ConditionalNavLink
          to={`/profile/${user.id}/view`}
          onClick={onProfileClick}
        >
          <UserName>{user.username}</UserName>
        </ConditionalNavLink>
        <ProfileDetail>{detailsText}</ProfileDetail>
      </StyledVerticalCenter>
    )
  }

  renderRight = () => {
    const {isFollowing, isYou} = this.props
    if (isYou) return null
    return (
      <VerticalCenter>
        <RoundedButton
          text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
          type={isFollowing ? undefined : 'blackWhite'}
          margin='none'
          width='154px'
          padding='even'
          onClick={this._onFollowClick}
        />
      </VerticalCenter>
    )
  }

  _onFollowClick = () => {
    const {user, onFollowClick} = this.props
    if(!user.id) onFollowClick(user._id)
    else onFollowClick(user.id)
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <SpaceBetweenRow
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderRight={this.renderRight}
        />
      </Container>
    )
  }
}
