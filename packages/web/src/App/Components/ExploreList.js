import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row } from './FlexboxGrid'
import getImageUrl from '../Shared/Lib/getImageUrl'
import VerticalCenter from './VerticalCenter'
import SpaceBetweenRow from './SpaceBetweenRow'
import RoundedButton from './RoundedButton'
import HorizontalDivider from './HorizontalDivider'

import {
  FollowButtonTextStyle,
  FollowButtonResponsiveTextStyle,
  FollowButtonResponsiveButtonStyle,
  LeftProps,
  RowProps,
} from './FollowFollowingRow'

const StyledList = styled(Grid)`
  max-width: 800px;
`

const FullWidthDiv = styled.div`
  width: 100%;
`

const CategoryTile = styled(VerticalCenter)`
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: cover;
  height: 77px;
  width: 77px;
`

const Title = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 18px;
  text-align: left;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .6px;
  margin: 0;
  padding-left: 25px;
  flex-shrink: 1;
  text-overflow: ellipsis;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
    padding-left: 0px;
  }
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

  renderImage = () => {
    const {category} = this.props
    return (
      <CategoryTile
        imageSource={
          getImageUrl(
            category.image,
            'categoryThumbnail',
            {width: 400, height: 400},
          )
        }
      />
    )
  }

  renderText = () => {
    const {category} = this.props
    return (
      <Title>{category.title}</Title>
    )
  }

  renderRight = () => {
    const { isSelected } = this.props
    return (
      <VerticalCenter>
        <RoundedButton
          text={isSelected ? 'FOLLOWING' : '+ FOLLOW'}
          type={isSelected ? undefined : 'blackWhite'}
          width='154px'
          padding='even'
          onClick={this._onClickTile}
          textProps={FollowButtonTextStyle}
          responsiveTextProps={FollowButtonResponsiveTextStyle}
          responsiveButtonProps={FollowButtonResponsiveButtonStyle}
        />
      </VerticalCenter>
    )
  }

  render(){
    return (
      <FullWidthDiv>
        <SpaceBetweenRow
          renderImage={this.renderImage}
          renderText={this.renderText}
          renderRight={this.renderRight}
          leftProps={LeftProps}
          rowProps={RowProps}
        />
        <HorizontalDivider
          color='grey'
        />
      </FullWidthDiv>
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
