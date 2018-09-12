import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  StyledVerticalCenter,
  UserName,
} from './Modals/Shared'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

export default class SendToRow extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.user.profile.avatar, 'larger')}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    return (
      <StyledVerticalCenter>
        <UserName>{user.username}</UserName>
      </StyledVerticalCenter>
    )
  }

  renderRight = () => {
    return (
      <VerticalCenter>
        <input
          type='radio'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <SpaceBetweenRow
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderRight={this.renderRight}
        />
        <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
