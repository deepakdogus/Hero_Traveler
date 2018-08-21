import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'
import {VerticalCenterStyles} from './VerticalCenter'
import OverlayHover from './OverlayHover'
import Colors from '../Shared/Themes/Colors'

const Wrapper = styled.div`
  margin: 1px;
  position: relative;
`

const CategoryTile = styled.div`
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 50%;
  padding-bottom: 50%;
  position: relative;
`

const TitleContainer = styled(OverlayHover)`
  ${VerticalCenterStyles};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`

const Title = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.2px;
  margin: 0;
`

const RedCheck = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
  border-color: ${Colors.white};
  border-style: solid;
  border-width: 1.3px;
  border-radius: 50%;
  background-color:  ${Colors.white};
`

// created specific component to optimize speed with _onClickTile
class Tile extends React.Component {
   static propTypes = {
    category: PropTypes.object,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool
  }

  _onClickTile = () => {
    this.props.onClick(this.props.category.id)
  }

  render(){
    const {category, isSelected} = this.props
    return (
      <Col xs={6} sm={4} md={3} lg={2} >
        <Wrapper onClick={this._onClickTile}>
          <CategoryTile
            imageSource={getImageUrl(category.image, 'optimized')}
          />
          <TitleContainer selected={category.selected} overlayColor="black">
            <Title>{category.title}</Title>
          </TitleContainer>
          {isSelected &&
            <RedCheck name='redCheck' />
          }
        </Wrapper>
      </Col>
    )
  }
}


export default class ExploreGrid extends React.Component {
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
      <Grid fluid>
        <Row>
          {renderedCategories}
        </Row>
      </Grid>
    )
  }
}
