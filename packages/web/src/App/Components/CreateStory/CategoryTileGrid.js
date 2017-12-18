import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from '../FlexboxGrid';
import Icon from '../Icon'
import { StyledInput } from './StoryDetails'

const WrapperCol = styled(Col)`
  max-width: 140px;
  margin: 10px;
`

const InputWrapper = styled(Col)`
  display: flex;
  flex-direction: 'column';
  justify-content: 'center';
`

const Tile = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  border-radius: 4px;
  height: 34px;
  z-index: 90;
  padding: 5px;
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
  margin-left: 10px;
`
const StyledGrid = styled(Grid)`
  margin-left: 46px;
  width: 90%;
  transform: translateY(-33.5px);
  margin-bottom: -40px;
`


export default class CategoryTileGrid extends React.Component {
  static propTypes = {
    selectedCategories: PropTypes.arrayOf(PropTypes.object),
    handleCategoryRemove: PropTypes.func,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    inputOnChange: PropTypes.func,
    inputOnClick: PropTypes.func,
  }

  render() {
    const {selectedCategories, handleCategoryRemove} = this.props

    const renderedTiles = selectedCategories.map((tag) => {
      return (
        <WrapperCol key={tag.id}>
    
            <Tile around='xs'>
              <TagText>{tag.title}</TagText>
              <StyledIcon
                data-tagName={tag.id}
                name='closeDark'
                onClick={handleCategoryRemove}
              />
            </Tile>

        </WrapperCol>
      )
    })

    return (
      <StyledGrid>
        <Row>
          {renderedTiles}
          <InputWrapper
          >
          <StyledInput
              type='text'
              placeholder={this.props.placeholder}
              value={this.props.inputValue}
              onChange={this.props.inputOnChange}
              onClick={this.props.inputOnClick}
            />
            </InputWrapper>
        </Row>
      </StyledGrid>
    )
  }
}
