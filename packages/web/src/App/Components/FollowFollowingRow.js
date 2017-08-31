import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import RoundedButton from './RoundedButton'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`

const UserName = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 0;
`

const ProfileDetail = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export default class FollowFollowingRow extends Component {
  static propTypes = {
    isFollowing: PropTypes.bool,
    user: PropTypes.object,
    type: PropTypes.oneOf(['count', 'follow'])
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.user.profile.avatar)}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    const detailsText = this.props.type === 'count' ? `${user.counts.followers} followers` : 'Lorum Ipsum'
    return (
      <StyledVerticalCenter>
        <UserName>{user.username}</UserName>
        <ProfileDetail>{detailsText}</ProfileDetail>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={this.props.isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
          type={this.props.isFollowing ? undefined : 'blackWhite'}
          margin='none'
          width='138px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <SpaceBetweenRowWithButton
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderButton={this.renderButton}
        />
      </Container>
    )
  }
}
