import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from '../FlexboxGrid';
import Icon from '../Icon'

const Wrapper = styled.div`
  margin: 5px;
  position: relative;
`

const Tile = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  border-radius: 4px;
  max-width: 116px;
  height: 34px;
  z-index: 90;
`

const TagText = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 15px;
  letter-spacing: .7px;
  margin: auto 0px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  height: 12px;
  width: 12px;
`
const StyledGrid = styled(Grid)`
  margin-left: 46px;
  width: 54%;
  transform: translateY(-33.5px);
  margin-bottom: -40px;
`

export default class CategoryTileGrid extends React.Component {
  static propTypes = {
    selectedCategories: PropTypes.arrayOf(PropTypes.object),
    handleCategoryRemove: PropTypes.func,
  }

  render() {
    const {selectedCategories, handleCategoryRemove} = this.props

    const renderedTiles = selectedCategories.map((tag) => {
      return (
        <Col key={tag.id} xs={12} sm={6} md={4} lg={3} >
          <Wrapper>
            <Tile around='xs'>
              <TagText>{tag.title}</TagText>
              <StyledIcon
                data-tagName={tag.id}
                name='closeDark'
                onClick={handleCategoryRemove}
              />
            </Tile>
          </Wrapper>
        </Col>
      )
    })

    return (
      <StyledGrid fluid>
        <Row>
          {renderedTiles}
        </Row>
      </StyledGrid>
    )
  }
}
