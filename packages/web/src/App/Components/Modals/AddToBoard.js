import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {feedExample} from '../../Containers/Feed_TEST_DATA'
import AddToBoardRow from '../AddToBoardRow'
import HorizontalDivider from '../HorizontalDivider'
import SpaceBetweenRowWithButton from '../SpaceBetweenRowWithButton'
import VerticalCenter from '../VerticalCenter'
import {RightTitle, StyledVerticalCenter, RightModalCloseX} from './Shared'
import Icon from '../Icon'

const Container = styled.div``

const CategoryRowsContainer = styled.div`
  padding: 25px;
`
const CreateContainer = styled.div`
  padding: 25px;
`
const CreateIconContainer = styled(VerticalCenter)`
  background-color: ${props => props.theme.Colors.inactiveRed};
  border-color: ${props => props.theme.Colors.bloodOrange};
  border-style: dashed;
  border-width: 5px;
  height: 85px;
  width: 85px;
`

const CreateText = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.bloodOrange};
  letter-spacing: .7px;
  margin: 0;
`

//test board images
const categoriesExample = feedExample[Object.keys(feedExample)[0]].categories
let categoriesExampleSliced = {};
for (var i=0; i<3; i++)
    categoriesExampleSliced[i] = categoriesExample[i];


export default class AddToBoard extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  renderImage = () => {
    return (
      <CreateIconContainer>
          <Icon
            name='components'
            size={'medium'}
            color={props => props.theme.Colors.bloodOrange}
          />
      </CreateIconContainer>
    )
  }  

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <CreateText>{"+Create new board"}</CreateText>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return null;
  }

  renderCategoryRows(categoryKeys) {
    return categoryKeys.map((key, index) => {
      return (
        <AddToBoardRow
          key={key}
          category={categoriesExampleSliced[key]}
          margin='0 0 25px'
        />
      )
    })
  }

  render() {
    const categoryKeys = Object.keys(categoriesExampleSliced)

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>ADD TO BOARD</RightTitle>
        <CreateContainer>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </CreateContainer>
        <HorizontalDivider color='light-grey'/>
        <CategoryRowsContainer>
          {this.renderCategoryRows(categoryKeys)}
        </CategoryRowsContainer>

      </Container>




    )
  }
}
