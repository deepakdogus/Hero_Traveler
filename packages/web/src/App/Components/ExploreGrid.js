import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid';
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'
import Icon from './Icon'
import {VerticalCenterStyles} from './VerticalCenter'
import OverlayHover from './OverlayHover'
import NavLinkStyled from './NavLinkStyled'

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
  background: ${props => props.selected ? 'rgba(256, 256, 256, 0.4)' : 'rgba(0, 0, 0, 0.3)'};
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
`

const CategoryLink = styled(NavLinkStyled)``

export default class ExploreGrid extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const {categories} = this.props

    const renderedCategories = categories.map((category) => {
      return (
        <Col key={category.id} xs={6} sm={4} md={3} lg={2} >
          <Wrapper>
            <CategoryLink to={`/category/${category._id}`}>
              <CategoryTile
                imageSource={getS3ImageUrl(category.image, 'versions.thumbnail240.path')}
              />
              <TitleContainer selected={category.selected}>
                <Title>{category.title}</Title>
              </TitleContainer>
              {category.selected &&
                <RedCheck name='redCheck' />
              }
            </CategoryLink>
          </Wrapper>
        </Col>
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
