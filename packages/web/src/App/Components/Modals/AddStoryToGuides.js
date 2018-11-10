import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import UXActions from '../../Redux/UXRedux'
import {
  mapStateToProps,
  mapDispatchToProps,
  SharedComponent,
} from '../../Shared/Lib/AddStoryToGuidesHelpers'
import FeedItemSelectRow, { DefaultContainer } from '../FeedItemSelectRow'
import SpaceBetweenRow from '../SpaceBetweenRow'
import VerticalCenter from '../VerticalCenter'
import CenteredButtons from '../CenteredButtons'
import RoundedButton from '../RoundedButton'
import {
  RightTitle,
  RightModalCloseX,
  StyledVerticalCenter,
} from './Shared'

import Icon from '../Icon'

const Container = styled.div``
const CategoryRowsContainer = styled.div``

const CreateContainer = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border: ${props => `0 solid ${props.theme.Colors.dividerGrey}`};
  border-width: 1px 0 1px;
  &:hover {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const CreateIconContainer = styled(VerticalCenter)`
  margin: 20px 0;
  width: 115px;
  height: 90px;
  background-color: ${props => props.theme.Colors.pink};
  border-color: ${props => props.theme.Colors.redLight};
  border-style: dashed;
  border-width: 1px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 67px;
    height: 50px;
    border: none;
  }
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const CreateText = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.redLight};
  letter-spacing: .2px;
  margin: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
  }
`

const ReplacementContainer = styled(DefaultContainer)`
  padding: 10px 20px;
  cursor: pointer;
  border: ${props => `0 solid ${props.theme.Colors.dividerGrey}`};
  border-width: 0 0 1px;
  &:hover {
    background-color: ${props => props.theme.Colors.onHoverGrey};
  }
`

const FixedCloseBar = styled(VerticalCenter)`
  position: fixed;
  bottom: 0;
  width: 570px;
  background-color: ${props => props.theme.Colors.snow};
  border-top: 1px solid ${props => props.theme.Colors.navBarText};
  > * {
    padding: 20px 0;
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100%;
  }
`

const Spacer = styled.div`
  height: 80px
`

const ResponsiveRightModalCloseX = styled(RightModalCloseX)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const RowProps = {
  'justify-content' : 'space-between',
  'flex-wrap' : 'nowrap',
}

class AddStoryToGuides extends SharedComponent {
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
        <CreateText>{'+ Create new guide'}</CreateText>
      </StyledVerticalCenter>
    )
  }

  renderRight() {
    return null
  }

  renderGuides() {
    const { isInGuideById } = this.state

    return this.props.guides.map((guide, index) => {
      return (
        <FeedItemSelectRow
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

  cancelButton = () => {
    return (
      <RoundedButton
        text={'Cancel'}
        margin='none'
        width='116px'
        type='blackWhite'
        padding='mediumEven'
        onClick={this.props.closeModal}
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

  exit() {
    this.props.closeModal()
  }

  createGuideReroute = () => {
    this.props.reroute('/edit/guide/new')
    this.props.closeModalWithParams({storyId: this.props.storyId})
  }

  render() {
    return (
      <Container>
        <RightTitle>ADD TO A GUIDE</RightTitle>
        <ResponsiveRightModalCloseX
          name='closeDark'
          onClick={this.props.closeModal}
        />
        <CreateContainer onClick={this.createGuideReroute}>
          <SpaceBetweenRow
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderRight={this.renderRight}
            rowProps={RowProps}
          />
        </CreateContainer>
        <CategoryRowsContainer>
          {this.renderGuides()}
        </CategoryRowsContainer>
        <Spacer/>
        <FixedCloseBar>
          <CenteredButtons
            buttonsToRender={[
              this.cancelButton,
              this.saveButton,
            ]}
          />
        </FixedCloseBar>
      </Container>
    )
  }
}

function extendedMapDispatchToProps(dispatch) {
  const mapping = mapDispatchToProps(dispatch)
  mapping.reroute = (path) => dispatch(push(path))
  mapping.closeModal = () => dispatch(UXActions.closeGlobalModal())
  mapping.closeModalWithParams = (params = {}) => {
    dispatch(UXActions.closeGlobalModalWithParams(params))
  }
  return mapping
}

export default connect(mapStateToProps, extendedMapDispatchToProps)(AddStoryToGuides)
