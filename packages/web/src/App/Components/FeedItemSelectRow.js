import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'
import {StyledVerticalCenter} from './Modals/Shared'

const verticalMetrics = {
  width: 77,
  height: 98,
}

const horizontalMetrics = {
  width: 140,
  height: 90,
}

function getMetric(isVertical, metric) {
  const metrics = isVertical ? verticalMetrics : horizontalMetrics
  return metrics[metric] + 'px'
}

const StyledImageWrapper = styled.div`
  width: ${props => getMetric(props.isVertical, 'width')};
  height: ${props => getMetric(props.isVertical, 'height')};
  display: flex;
  justify-content: ${props => props.isVertical ? 'center' : 'left'};
  align-items: center;
  overflow: hidden;
  cursor: pointer;
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`

export const DefaultContainer = styled.div`
  border: ${props => `0 solid ${props.theme.Colors.dividerGrey}`};
  border-width: ${props => props.index === 0 ? '1px 0 1px' : '0 0 1px'};
  padding: 5px 5px 0;
`

const Text = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .7px;
  margin: 0;
  cursor: pointer;
`

const UserName = styled(Text)`
  color: ${props => props.theme.Colors.grey};
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
`

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
    username: PropTypes.string,
    index: PropTypes.number,
    navToStory: PropTypes.func,
    navToUserProfile: PropTypes.func,
    isVertical: PropTypes.bool,
    onSelect: PropTypes.func,
    ReplacementContainer: PropTypes.func,
  }

  _handleStoryClick = () => {
    const {story, onSelect} = this.props
    if (onSelect) this.onSelect()
    else this.props.navToStory(story.id || story.objectID)
  }

  onSelect = () => {
    this.props.onSelect(this.props.story.id)
  }

  renderImage = () => {
    const src = getImageUrl(
      this.props.story.coverImage,
      'optimized',
      this.props.isVertical ? verticalMetrics : horizontalMetrics,
    )

    return (
      <StyledImageWrapper isVertical={this.props.isVertical}>
        <StyledImage
          src={src}
          alt='ADD ALT TEXT'
          onClick={this._handleStoryClick}
        />
      </StyledImageWrapper>
    )
  }

  renderText = () => {
    const {username, story} = this.props

    return (
      <StyledVerticalCenter>
          <Text
            onClick={this._handleStoryClick}
          >
            {story.title}
          </Text>
          {username &&
            <UserName
              onClick={this._handleProfileClick}
            >
              {username}
            </UserName>
          }
      </StyledVerticalCenter>
    )
  }

  renderRight = () => {
    const {isSelected, onSelect} = this.props
    if (!onSelect) return null
    const iconName = isSelected ? 'redCheck' : 'greyCheck'

    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  render() {
    const {
      index,
      ReplacementContainer,
      onSelect,
    } = this.props
    let Container = ReplacementContainer || DefaultContainer
    const containerProps = { index }
    if (onSelect) containerProps.onClick = this.onSelect

    return (
      <Container {...containerProps}>
        <SpaceBetweenRow
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderRight={this.renderRight}
        />
      </Container>
    )
  }
}
