import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
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
`

const Container = styled.div`
  padding: 8px 30px 8px 30px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

// const Text = styled.p`
//   font-family: ${props => props.theme.Fonts.type.base};
//   font-weight: 600;
//   font-size: 18px;
//   letter-spacing: .7px;
//   margin: 0;
// `

const UserName = styled(DefaultText)`
  color: ${props => props.theme.Colors.grey};
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
  padding-left: 25px;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;

`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

const DefaultWrapper = styled.div``

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
    username: PropTypes.string,
    renderButton: PropTypes.bool,
    styles: PropTypes.object,
    index: PropTypes.number,
    closeModal: PropTypes.func,
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
    const {isSelected, renderButton, isAddToBoard} = this.props
    if (!renderButton) return null
    const unSelectedIconName = isAddToBoard ? 'redCheck' : 'createStory'
    const iconName = isSelected ? 'redCheck' : unSelectedIconName;

    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  renderNormalContainer = () => {
    return(
        <div>
          <Container index={this.props.index}>
            <SpaceBetweenRowWithButton
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderButton={this.renderButton}
            />
          </Container>
          <StyledHorizontalDivider color='light-grey'/>
        </div>
      )
  }

  renderInteractiveContainer = () => {
    return(
        <InteractiveContainer>
          <Container index={this.props.index}>
            <SpaceBetweenRowWithButton
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderButton={this.renderButton}
            />
          </Container>
          <StyledHorizontalDivider color='light-grey'/>
        </InteractiveContainer>
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
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </Container>
      </Wrapper>
    )
  }
}
