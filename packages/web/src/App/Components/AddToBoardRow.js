import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
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

export default class AddToBoardRow extends Component {
  static propTypes = {
    category: PropTypes.object
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.category.image)}
        size='larger'
        square={true}
      />
    )
  }

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <UserName>{this.props.category.title}</UserName>
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
