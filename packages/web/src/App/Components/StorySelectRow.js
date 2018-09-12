import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'
import {StyledVerticalCenter} from './Modals/Shared'

const StyledImageWrapper = styled.div`
  width: 77px;
  height: 98px;
<<<<<<< HEAD
=======
  cursor:pointer;
>>>>>>> ca243913cf5f97ad0cb66aec011d9cfd3542f1d6
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
`

const StyledImage = styled.img`
  height: 100%;
`

export const DefaultContainer = styled.div`
  border: ${props => `1px solid ${props.theme.Colors.dividerGrey}`};
  border-width: ${props => props.index === 0 ? '1px 0 1px' : '0 0 1px'};
  padding: 5px 5px 0;
`

const DefaultText = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .7px;
  margin: 0;
  cursor: pointer;
`

const Container = styled.div`
  padding: 8px 30px 8px 30px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const UserName = styled(DefaultText)`
  color: ${props => props.theme.Colors.grey};
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
`

const DefaultWrapper = styled.div``

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
    username: PropTypes.string,
    renderRight: PropTypes.bool,
    styles: PropTypes.object,
    index: PropTypes.number,
    navToStory: PropTypes.func,
    navToUserProfile: PropTypes.func
  }

  _handleStoryClick = () => {
    const {story} = this.props
    this.props.navToStory(story.id || story.objectID)
  }

  renderImage = () => {
    const src = getImageUrl(this.props.story.coverImage)
    return (
      <StyledImageWrapper>
        <StyledImage
          src={src}
          alt='ADD ALT TEXT'
          onClick={this._handleStoryClick}
        />
      </StyledImageWrapper>

    )
  }

  renderText = () => {
    const {username, story, textStyles} = this.props
    let Text = DefaultText
    if (textStyles) Text = styled(DefaultText)`${textStyles}`

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
    const {isSelected, renderRight, isAddToBoard} = this.props
    if (!renderRight) return null
    const unSelectedIconName = isAddToBoard ? 'redCheck' : 'createStory'
    const iconName = isSelected ? 'redCheck' : unSelectedIconName;

    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  render() {
    const {index, ReplacementContainer} = this.props
    let Container = ReplacementContainer || DefaultContainer
    let Wrapper = DefaultWrapper
    if (this.props.isAddToBoard) Wrapper = InteractiveContainer
    return (
      <Wrapper>
        <Container index={index}>
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderRight}
          />
        </Container>
      </Wrapper>
    )
  }
}
