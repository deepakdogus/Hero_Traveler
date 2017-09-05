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
  padding: 8px 30px 8px 30px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const Text = styled.p`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.background};
  margin: 0;
  padding-left: 25px;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
`

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
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
    return (
      <StyledVerticalCenter>
        <Text>{this.props.story.title}</Text>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    const unSelectedIconName = this.props.isAddToBoard ? 'redCheck' : 'createStory'
    const iconName = this.props.isSelected ? 'redCheck' : unSelectedIconName;
    
    return (
      <VerticalCenter>
        <Icon name={iconName} />
      </VerticalCenter>
    )
  }

  renderNormalContainer = () => {
    return(
        <Container index={this.props.index}>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </Container>        
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
        </InteractiveContainer>        
      )
  }

  render() {
    return (
      <div>
        {this.props.isAddToBoard ? this.renderInteractiveContainer () : this.renderNormalContainer()}  
      </div>        
    )
  }
}
