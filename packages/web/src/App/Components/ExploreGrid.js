import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from '../Shared/Web/Components/FlexboxGrid'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from '../Shared/Web/Components/Icon'
import { VerticalCenterStyles } from '../Shared/Web/Components/VerticalCenter'
import OverlayHover from './OverlayHover'

const StyledGrid = styled(Grid)`
  max-width: 1000px;
`

const Wrapper = styled.div`
  margin: 10px;
  position: relative;
  cursor: pointer;
  ${props => props.isCategory ? 'margin-bottom: 10px;' : 'margin-bottom: 20px;'}
`

const CategoryTile = styled.div`
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 50%;
  padding-bottom: 50%;
  position: relative;
`

const ChannelTile = styled.div`
  min-height: 120px;
  max-height: 140px;
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 50%;
  padding-bottom: 50%;
`

const TitleContainer = styled(OverlayHover)`
  ${VerticalCenterStyles};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  opacity: 1;
  background: rgba(0, 0, 0, 0.3);
`

const Title = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .6px;
  margin: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const RedCheck = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
  border-color: ${props => props.theme.Colors.snow};
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  background-color: ${props => props.theme.Colors.snow};
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
    const image = category.image || category.channelImage || null
    let row = category.image ? 4 : 2
    let col = category.image ? 3 : 2
    return (
      <Col xs={row} lg={col} >
        <Wrapper onClick={this._onClickTile} isCategory={category.image ? true : false}>
          {
              category.image ? 
            <CategoryTile
              imageSource={
                getImageUrl(
                  image,
                  'categoryThumbnail',
                  {width: 400, height: 400},
                )
              }
            />
            :
            <ChannelTile
              imageSource={
                getImageUrl(
                  image,
                  'original',
                )
              }
            />
          }
          <TitleContainer
            selected={category.selected}
            overlayColor='black'
          >
            <Title>{category.title || null}</Title>
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
      <StyledGrid fluid>
        <Row>
          {renderedCategories}
        </Row>
      </StyledGrid>
    )
  }
}
