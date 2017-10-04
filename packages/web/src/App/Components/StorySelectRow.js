import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'

const StyledImage = styled.img`
  width: 77px;
  height: 98px;
`

export const DefaultContainer = styled.div`
  border: ${props => `1px solid ${props.theme.Colors.dividerGrey}`};
  border-width: ${props => props.index === 0 ? '1px 0' : '0 0 1px'};
  padding: 5px 5px 0;
`

const DefaultText = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 16px;
  font-weight: 400;
  letter-spacing: .7px;
  margin: 0;
`

const UserName = styled(DefaultText)`
  color: ${props => props.theme.Colors.grey};
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;

`

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
    username: PropTypes.string,
    renderButton: PropTypes.bool,
    styles: PropTypes.object,
  }

  renderImage = () => {
    const src = getImageUrl(this.props.story.coverImage)
    return (
      <StyledImage src={src} alt='ADD ALT TEXT'/>
    )
  }

  renderText = () => {
    const {username, story, textStyles} = this.props

    let Text = DefaultText
    if (textStyles) Text = styled(DefaultText)`${textStyles}`

    return (
      <StyledVerticalCenter>
        <Text>{story.title}</Text>
        {username && <UserName>{username}</UserName>}
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    const {isSelected, renderButton} = this.props
    if (!renderButton) return null
    const iconName = isSelected ? 'redCheck' : 'createStory'
    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  render() {
    const {index, ReplacementContainer} = this.props
    let Container = ReplacementContainer || DefaultContainer

    return (
      <Container index={index}>
        <SpaceBetweenRowWithButton
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderButton={this.renderButton}
        />
      </Container>
    )
  }
}
