import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import {
  mapStateToProps,
  mapDispatchToProps,
  BaseComponent,
} from '../../Shared/Lib/addStoryToGuidesHelpers'
import StorySelectRow, {DefaultContainer} from '../StorySelectRow'
import SpaceBetweenRow from '../SpaceBetweenRow'
import VerticalCenter from '../VerticalCenter'
import CenteredButtons from '../CenteredButtons'
import RoundedButton from '../RoundedButton'
import {
  RightTitle,
  StyledVerticalCenter,
  RightModalCloseX,
} from './Shared'
import Icon from '../Icon'

const Container = styled.div``
const CategoryRowsContainer = styled.div``

const CreateContainer = styled.div`
  padding: 8px 30px;
`

const CreateIconContainer = styled(VerticalCenter)`
  background-color: ${props => props.theme.Colors.pink};
  border-color: ${props => props.theme.Colors.redLight};
  border-style: dashed;
  border-width: 1px;
  height: 90px;
  width: 140px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const CreateText = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.redLight};
  letter-spacing: .7px;
  margin: 0;
`

const ReplacementContainer = styled(DefaultContainer)`
  padding: 5px 30px 5px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

class AddStoryToGuides extends BaseComponent {
  renderImage() {
    return (
      <CreateIconContainer>
        <StyledIcon
          name='createGuide'
          height='25px'
          width='25px'
        />
      </CreateIconContainer>
    )
  }

  renderText() {
    return (
      <StyledVerticalCenter>
        <CreateText>{"+ Create new guide"}</CreateText>
      </StyledVerticalCenter>
    )
  }

  renderRight() {
    return null
  }

  renderGuides(categoryKeys) {
    const { isInGuideById } = this.state

    return this.props.guides.map((guide, index) => {
      return (
        <StorySelectRow
          key={guide.id}
          index={index}
          story={guide}
          isSelected={isInGuideById[guide.id]}
          onSelect={this.toggleGuide}
          isVertical={false}
          ReplacementContainer={ReplacementContainer}
        />
      )
    })
  }

  exit() {
    this.props.closeModal()
  }

  cancelButton = () => {
    return (
      <RoundedButton
        text={'Cancel'}
        margin='none'
        width='116px'
        type='blackWhite'
        padding='mediumEven'
        onClick={this.closeModal}
      />
    )
  }

  saveButton = () => {
    return (
      <RoundedButton
        text={'Save Changes'}
        margin='none'
        width='180px'
        padding='mediumEven'
        onClick={this.onDone}
      />
    )
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>ADD TO GUIDE</RightTitle>
        <CreateContainer>
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderRight}
          />
        </CreateContainer>
        <CategoryRowsContainer>
          {this.renderGuides()}
        </CategoryRowsContainer>
        <CenteredButtons
          buttonsToRender={[
            this.cancelButton,
            this.saveButton,
          ]}
        >
        </CenteredButtons>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStoryToGuides)

