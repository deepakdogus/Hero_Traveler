import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'
import Icon from './Icon'

const StyledImage = styled.img`
  width: 75px;
`

const Container = styled.div`
  padding: 8px 30px 8px 30px;
`

const InteractiveContainer = styled.div`
  &:hover ${Container} {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const Text = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
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

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

export default class StorySelectRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    story: PropTypes.object,
    index: PropTypes.number,
    closeModal: PropTypes.func,
  }

  renderImage = () => {
    const src = getS3ImageUrl(this.props.story.coverImage)
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
    return (
      <div>
        {this.props.isAddToBoard ? this.renderInteractiveContainer () : this.renderNormalContainer()}  
      </div>        
    )
  }
}
