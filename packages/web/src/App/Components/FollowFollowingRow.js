import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from '../Shared/Web/Components/Avatar'
import RoundedButton from '../Shared/Web/Components/RoundedButton'
import HorizontalDivider from './HorizontalDivider'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
  min-height: 90px;
  display: flex;
  flex-direction: column;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: ${props => props.responsiveMargin ? props.responsiveMargin : '0'};
    min-height: 70px;
  }
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 90%;
  padding-left: 25px;
  flex-shrink: 1;
  text-overflow: ellipsis;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 0px;
  }
`

const UserName = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  margin: 0;
  cursor: ${props => props.onClick ? 'pointer' : 'auto'};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0px 15px;
    font-size: 16px;
  }
`

const ProfileDetail = styled(UserName)`
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.grey};
`

const StyledDivider = styled(HorizontalDivider)`
  width: 100%;
  margin: 12px 0;
`

export const LeftProps = {
  'flex-wrap' : 'nowrap',
  'align-items' : 'center',
}

export const RowProps = {
  'justify-content' : 'space-between',
  'flex-wrap' : 'nowrap',
}

export const FollowButtonTextStyle = `
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 6px;
`

export const FollowButtonResponsiveTextStyle = `
  font-size: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
`

export const FollowButtonResponsiveButtonStyle = `
  width: 100px;
  margin: 0;
`

const AvatarResponsiveStyle = `
  width: 50px;
  height: 50px;
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
    const {user, onProfileClick} = this.props
    if (onProfileClick) onProfileClick(user.id || user._id, user)
  }

  getOnclick = () => {
    if (this.props.onProfileClick) return this._handleProfileClick
    else return undefined
  }

  renderImage = () => {
    const {user} = this.props
    return (
      <Avatar
        avatarUrl={getImageUrl(_.get(user, 'profile.avatar'), 'avatarLarge')}
        size='larger'
        type='profile'
        onClick={this.getOnclick()}
        responsiveProps={AvatarResponsiveStyle}
      />
    )
  }

  renderText = () => {
    const {user, type} = this.props
    const detailsText = type === 'count'
      ? `${_.get(user, 'counts.followers', 0)} followers`
      : `${_.get(user, 'profile.fullName')}`
    return (
      <StyledVerticalCenter>
        <UserName
          onClick={this.getOnclick()}
        >
          {user.username}
        </UserName>
        <ProfileDetail
          onClick={this.getOnclick()}
        >
          {detailsText}
        </ProfileDetail>
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
          width='154px'
          padding='even'
          onClick={this._onFollowClick}
          textProps={FollowButtonTextStyle}
          responsiveTextProps={FollowButtonResponsiveTextStyle}
          responsiveButtonProps={FollowButtonResponsiveButtonStyle}
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
          leftProps={LeftProps}
          rowProps={RowProps}
        />
        <StyledDivider color="lighter-grey"/>
      </Container>
    )
  }
}
