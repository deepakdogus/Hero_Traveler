import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRow from './SpaceBetweenRow'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'
import {StyledVerticalCenter} from './Modals/Shared'
import NavLink from './NavLinkStyled'

const StyledImage = styled.img`
  width: 77px;
  height: 98px;
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

const ConditionalNavLink = (props) => {
  if(!props.onClick) return <div {...props}/>
  return ( <NavLink {...props} /> )
}

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
    this.props.navToStory(this.props.story.objectID)
  }

  _handleProfileClick = () => {

  }

  renderImage = () => {
    const src = getImageUrl(this.props.story.coverImage)
    return (
        <StyledImage 
          src={src} 
          alt='ADD ALT TEXT'
          onClick={this._handleStoryClick}
        />
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
          {username && <UserName onClick={this._handleProfileClick} >{username}</UserName>}
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
