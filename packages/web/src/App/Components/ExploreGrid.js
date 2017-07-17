import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid';
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'

const Wrapper = styled.div`
  margin: 1px;
`

const CategoryTile = styled.div`
  background-image: ${props => `url(${props.imageSource})`};
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 50%;
  padding-bottom: 50%;
  position: relative;
`

const TitleContainer = styled.div`
  position: absolute;
  color: ${props => `${props.theme.Colors.snow}`};
  width: 100%;
`

const Title = styled.div`
  margin: 0;
`

const RedCheck = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`

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
            <CategoryTile
              imageSource={getImageUrl(category.image, 'versions.thumbnail240.path')}
            >
              <TitleContainer>
                <Title>{category.title}</Title>
              </TitleContainer>
              {category.selected &&
                <RedCheck name='redCheck' />
              }
            </CategoryTile>
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
