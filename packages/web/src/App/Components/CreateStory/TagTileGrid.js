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
  
`

const TagText = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 15px;
  letter-spacing: .7px;
  background-color: ${props => props.theme.Colors.lightGreyAreas}; 
  border-radius: 4px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  height: 5px;
  width: 5px;
`

export default class TagTileGrid extends React.Component {
  static propTypes = {
    tileTags: PropTypes.arrayOf(PropTypes.string),
    handleTileClick: PropTypes.func,
  }

  render() {
    const {tileTags, handleTileClick} = this.props

    const renderedTiles = tileTags.map((tag) => {
      return (
        <Col key={tag} xs={6} sm={4} md={3} lg={2} >
          <Wrapper>
            <Tile>
              <TagText>{tag}</TagText>
              <StyledIcon 
                data-tagName={tag}
                name='close'
                onClick={handleTileClick}
              />              
            </Tile>
          </Wrapper>
        </Col>
      )
    })

    return (
      <Grid fluid>
        <Row>
          {renderedTiles}
        </Row>
      </Grid>
    )
  }
}
