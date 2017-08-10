import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {usersExample} from '../../Containers/Feed_TEST_DATA'
import {feedExample} from '../../Containers/Feed_TEST_DATA'
import AddToBoardRow from '../AddToBoardRow'
import InputRow from '../InputRow'
import HorizontalDivider from '../HorizontalDivider'
import SpaceBetweenRowWithButton from '../SpaceBetweenRowWithButton'
import VerticalCenter from '../VerticalCenter'
import {RightTitle, StyledInput, StyledVerticalCenter} from './Shared'
import Icon from '../Icon'
import {Colors} from '../../Shared/Themes'

const Container = styled.div``

const CategoryRowsContainer = styled.div`
  padding: 25px;
`
const CreateContainer = styled.div`
  padding: 25px;
`
const CreateIconContainer = styled(VerticalCenter)`
  background-color: ${Colors.inactiveRed};
  border-color: ${Colors.bloodOrange};
  border-style: dashed;
  border-width: 5px;
  height: 85px;
  width: 85px;
`

// export const StyledVerticalCenter = styled(VerticalCenter)`
//   height: 100%;
//   padding-left: 25px;
// `

const Title = styled.p`
  font-weight: 400;
  font-size: 23px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  margin: 25px 0 10px;
`

const CreateText = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${Colors.bloodOrange};
  letter-spacing: .7px;
  margin: 0;
`

const categoriesExample = feedExample[Object.keys(feedExample)[0]].categories
//test board images
const boardImages = [];

// feedExample[Object.keys(feedExample)[0]].categories.forEach(function(cat){ return boardImages.push(cat.image) })

console.log("__filename: ", __filename)
console.log("categoriesExample: ", categoriesExample)

export default class SendTo extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
  }

  renderImage = () => {
    return (
      <CreateIconContainer>
          <Icon
            name='components'
            size={'medium'}
            color={Colors.bloodOrange}
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
          category={categoriesExample[key]}
          margin='0 0 25px'
        />
      )
    })
  }

  render() {
    // const {profile} = this.props
    const categoryKeys = Object.keys(categoriesExample)

    return (
      <Container>
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
