import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import algoliasearch_module from 'algoliasearch'
import algoliasearch_helper from 'algoliasearch_helper'
import _ from 'lodash'
import { Grid, Row, Col } from '../FlexboxGrid';
import Icon from '../Icon'
import { StyledInput } from './StoryDetails'
import config from '../../Config/Env'

const { SEARCH_APP_NAME, SEARCH_API_KEY, SEARCH_CATEGORIES_INDEX } = config
const algoliasearch = algoliasearch_module(SEARCH_APP_NAME, SEARCH_API_KEY, { protocol: 'https:'})


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
    categories: PropTypes.arrayOf(PropTypes.object),
    handleCategoryRemove: PropTypes.func,
    updateCategoriesList: PropTypes.func,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    inputOnChange: PropTypes.func,
    inputOnClick: PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      inputText: '',
    }
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
      // do something?
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
    this.props.addCategory(this.state.inputText)
  }
  handleTextInput = (event) => {
    const text = event.target.value
    this.setState({
      inputText: text,
    })
    // if text > 3 chars
    this.helper
    .setQuery(text)
    .search()

    // I might want to use debounce from lodash to delay call
//https://css-tricks.com/debouncing-throttling-explained-examples/

    // index.search(text, (err, content) => {
    //   console.log('SEARCH', err, content)
    //   if (!err) {
    //     const newList = content.hits.map(hit => {
    //       const alreadyExists = _.find(this.props.categories, cat => cat.title === hit.title)
    //       return alreadyExists || hit
    //     })
    //     this.props.updateCategoriesList(newList)
    //   }
    // })
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
              placeholder='Add Categories'
              value={this.state.inputText}
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
