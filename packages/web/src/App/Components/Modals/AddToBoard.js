import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {feedExample} from '../../Containers/Feed_TEST_DATA'
import StorySelectRow from '../StorySelectRow'
import SpaceBetweenRowWithButton from '../SpaceBetweenRowWithButton'
import VerticalCenter from '../VerticalCenter'
import {RightTitle, StyledVerticalCenter, RightModalCloseX} from './Shared'
import Icon from '../Icon'

const Container = styled.div``

const CategoryRowsContainer = styled.div`

`
const CreateContainer = styled.div`
  padding: 9px 30px 8px 30px;
`
const CreateIconContainer = styled(VerticalCenter)`
  background-color: ${props => props.theme.Colors.pink};
  border-color: ${props => props.theme.Colors.redLight};
  border-style: dashed;
  border-width: 1px;
  height: 103px;
  width: 73px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const CreateText = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.redLight};
  letter-spacing: .7px;
  margin: 0;
`

const storyKeys = Object.keys(feedExample).filter((key, index) => {
  return index <= 2
})

export default class AddToBoard extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderImage = () => {
    return (
      <CreateIconContainer>
          <StyledIcon
            name='components'
            height='25px'
            width='25px'
            color={props => props.theme.Colors.redLight}
          />
      </CreateIconContainer>
    )
  }  

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <CreateText>{"+Create new collection"}</CreateText>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return null;
  }

  renderCategoryRows(categoryKeys) {
    return storyKeys.map((key, index) => {
      return (
        <StorySelectRow
          key={key}
          index={index}
          story={feedExample[key]}
          isSelected={index === 0}
          isAddToBoard={true}
          closeModal={this.props.closeModal}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>ADD TO COLLECTION</RightTitle>
        <CreateContainer>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </CreateContainer>
        <CategoryRowsContainer>
          {this.renderCategoryRows(storyKeys)}
        </CategoryRowsContainer>

      </Container>




    )
  }
}
