import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'

const StyledImage = styled.img`
  width: 75px;
`

const Container = styled.div`
  border: ${props => `1px solid ${props.theme.Colors.dividerGrey}`};
  border-width: ${props => props.index === 0 ? '1px 0' : '0 0 1px'};
  padding: 5px 5px 0;
`
const Text = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.background};
  margin: 0;
  padding-left: 15px;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
`

// this Component should only be used for placement
export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
  }

  renderImage = () => {
    const src = getImageUrl(this.props.story.coverImage)
    return (
      <StyledImage src={src} alt='ADD ALT TEXT'/>
    )
  }

  renderText = () => {
    return (
        <StyledVerticalCenter>
          <Text>{this.props.story.title}</Text>
        </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    const iconName = this.props.isSelected ? 'redCheck' : 'createStory'
    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container index={this.props.index}>
        <SpaceBetweenRowWithButton
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderButton={this.renderButton}
        />
      </Container>
    )
  }
}
