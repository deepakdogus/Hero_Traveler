import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { VerticalCenterStyles } from './VerticalCenter'

const StyledList = styled(Grid)`
  max-width: 800px;
`

const Wrapper = styled.div`
  margin: 1px;
  position: relative;
  display: flex;
  margin-top: 10px;
  flex-direction: row;
  padding-bottom: 10px;
  border-bottom: 2px solid;
  border-color: #e6e6e6;
`

const CategoryTile = styled.div`
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: cover;
  height: 77px;
  width: 77px;
`

const TitleContainer = styled.div`
  ${VerticalCenterStyles};
  flex: 1;
`

const ActionContainer = styled.div`
  ${VerticalCenterStyles};
  flex: 1;
`

const Title = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  text-align: left;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .6px;
  margin: 0;
  padding-left: 30px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const Button = styled.div`
  align-self: flex-end;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  letter-spacing: .7px;
  font-size: 18px;
  padding: 10px;
  width: 150px;
  height: 20px;
  color: ${props => props.isSelected ? props.theme.Colors.white : props.theme.Colors.background};
  border-color: ${props => props.isSelected ? props.theme.Colors.red : props.theme.Colors.background};
  border-style: solid;
  border-width: 2px;
  border-radius: 50px;
  background-color: ${props => props.isSelected ? props.theme.Colors.red : 'transparent'};
  cursor: pointer;
`

// created specific component to optimize speed with _onClickTile
class Tile extends React.Component {
   static propTypes = {
    category: PropTypes.object,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool,
  }

  _onClickTile = () => {
    this.props.onClick(this.props.category.id)
  }

  render(){
    const {category, isSelected} = this.props
    return (
      <Col xs={12}>
        <Wrapper onClick={this._onClickTile}>
          <CategoryTile
            imageSource={
              getImageUrl(
                category.image,
                'categoryThumbnail',
                {width: 400, height: 400},
              )
            }
          />
          <TitleContainer
            selected={category.selected}
            overlayColor='black'
          >
            <Title>{category.title}</Title>
          </TitleContainer>
          <ActionContainer>
            <Button isSelected={isSelected}>
              {isSelected ? 'FOLLOWING' : '+FOLLOW'}
            </Button>
          </ActionContainer>
        </Wrapper>
      </Col>
    )
  }
}

export default class ExploreList extends React.Component {
  static propTypes = {
    categories: PropTypes.object,
    onClickCategory: PropTypes.func,
    getIsSelected: PropTypes.func,
  }

  render() {
    const {categories, getIsSelected, onClickCategory} = this.props

    const renderedCategories = Object.keys(categories).map((key) => {
      const category = categories[key]
      return (
        <Tile
          key={category.id}
          category={category}
          isSelected={getIsSelected ? getIsSelected(category.id) : false}
          onClick={onClickCategory}
        />
      )
    })

    return (
      <StyledList fluid>
        <Row>
          {renderedCategories}
        </Row>
      </StyledList>
    )
  }
}
