import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import algoliasearch_module from 'algoliasearch'
import algoliasearch_helper from 'algoliasearch-helper'
import _ from 'lodash'
import { Grid, Row, Col } from '../FlexboxGrid';
import Icon from '../Icon'
import { StyledInput } from './StoryDetails'
import config from '../../Config/Env'

const { SEARCH_APP_NAME, SEARCH_API_KEY, SEARCH_CATEGORIES_INDEX } = config
const algoliasearch = algoliasearch_module(SEARCH_APP_NAME, SEARCH_API_KEY, { protocol: 'https:'})


const WrapperCol = styled(Col)`
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
    categories: PropTypes.arrayOf(PropTypes.object),
    handleCategoryRemove: PropTypes.func,
    updateCategoriesList: PropTypes.func,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    inputOnChange: PropTypes.func,
    inputOnClick: PropTypes.func,
    categoryInputText: PropTypes.string,
    handleTextInput: PropTypes.func,
  }

  constructor() {
    super()
  }
  componentWillMount() {
    this.helper = algoliasearch_helper(algoliasearch, SEARCH_CATEGORIES_INDEX)
    this.setUpSearchListeners(this.helper)
  }
  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }
  setUpSearchListeners = (helper) => {
    helper.on('result', res => {
      console.log('Here are my results', res)
      // do something?
      if (res.hits && res.hits.length){
        this.props.updateCategoriesList(res.hits)
      }
    })
    helper.on('search', () => {
      // do something?
    })
  }
  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }
  addCategory = () => {
    this.props.addCategory(this.props.categoryInputText)
  }
  handleTextInput = (event) => {
    const text = event.target.value
    this.props.handleTextInput(text)
    console.log('TEXT', text)
    if (text.length >= 3) {
      _.debounce(() => {
        this.helper
        .setQuery(text)
        .search()
      }, 300)()
    }
    //  _.debounce(() => {
    //   helper
    //     .setQuery(q)
    //     .search()
    // }, 300)()
    // I might want to use debounce from lodash to delay call
//https://css-tricks.com/debouncing-throttling-explained-examples/

  }
  render() {
    const {selectedCategories, handleCategoryRemove} = this.props

    const renderedTiles = selectedCategories.map((tag) => {
      return (
        <WrapperCol key={tag.id ? tag.id : tag.title}>
          <Tile around='xs'>
            <TagText>{tag.title}</TagText>
            <StyledIcon
              data-tagName={tag.id}
              name='closeDark'
              onClick={(e) => handleCategoryRemove(e, tag.id)}
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
              placeholder='Add Categories'
              value={this.props.categoryInputText}
              onChange={this.handleTextInput}
              onClick={this.props.inputOnClick}
              onKeyPress={(e) => { 
                if (e.key === 'Enter') {
                  this.addCategory()
              }}}
            />
            </InputWrapper>
        </Row>
      </StyledGrid>
    )
  }
}
