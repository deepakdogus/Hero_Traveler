import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import RoundedButton from './RoundedButton'

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
  cursor: pointer;
`

const ProfileDetail = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

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

  _handleProfileClick = () => {
    const {user} = this.props
    this.props.onProfileClick(user.id || user._id)
  }

  renderImage = () => {
    const {user} = this.props
    return (
        <Avatar
          avatarUrl={getImageUrl(user.profile.avatar)}
          size='larger'
          onClick={this._handleProfileClick}
        />
    )
  }

  renderText = () => {
    const {user, type} = this.props
    const detailsText = type === 'count' ? `${user.counts.followers} followers` : 'Lorum Ipsum'
    return (
      <StyledVerticalCenter>
          <UserName
            onClick={this._handleProfileClick}
          >
            {user.username}
          </UserName>
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
    onFollowClick(user.id || user._id)
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
