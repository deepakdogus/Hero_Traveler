import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'
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
        avatarUrl={getS3ImageUrl(this.props.user.profile.avatar)}
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

  renderButton = () => {
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
        <SpaceBetweenRowWithButton
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderButton={this.renderButton}
        />
        <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
