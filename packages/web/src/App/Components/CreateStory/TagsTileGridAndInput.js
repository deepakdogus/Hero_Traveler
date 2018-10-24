import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import algoliasearch_module from 'algoliasearch'
import algoliasearch_helper from 'algoliasearch-helper'
import _ from 'lodash'

import {
  Grid,
  Row,
  Col,
} from '../FlexboxGrid'
import { StyledInput } from './FeedItemDetails'
import config from '../../Config/Env'
import Tile from './Tile'

const {
  SEARCH_APP_NAME,
  SEARCH_API_KEY,
  SEARCH_CATEGORIES_INDEX,
  SEARCH_HASHTAGS_INDEX,
} = config
const algoliasearch = algoliasearch_module(
  SEARCH_APP_NAME,
  SEARCH_API_KEY,
  { protocol: 'https:' }
)

const InputWrapper = styled(Col)`
  display: flex;
  flex-direction: 'column';
  justify-content: 'center';
`

const StyledGrid = styled(Grid)`
  margin-left: 0px;
  width: 90%;
`

const VerticallyCenterRow = styled(Row)`
  align-items: center;
`

const TilesWrapper = styled.div`
  margin-left: 15px;
  flex-direction: row;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`

export default class TagsTileGridAndInput extends React.Component {
  static propTypes = {
    selectedTags: PropTypes.arrayOf(PropTypes.object),
    handleTagRemove: PropTypes.func,
    updateTagsList: PropTypes.func,
    placeholder: PropTypes.string,
    inputValue: PropTypes.string,
    inputOnChange: PropTypes.func,
    inputOnClick: PropTypes.func,
    inputText: PropTypes.string,
    handleTextInput: PropTypes.func,
    addTag: PropTypes.func,
    isSameTag: PropTypes.func,
    type: PropTypes.string,
  }

  componentWillMount() {
    this.helper = algoliasearch_helper(
      algoliasearch,
      this.props.type === 'hashtag' ? SEARCH_HASHTAGS_INDEX : SEARCH_CATEGORIES_INDEX,
    )
    this.setUpSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  setUpSearchListeners = (helper) => {
    helper.on('result', res => {
      if (res.hits){
        this.props.updateTagsList(_.differenceWith(
          res.hits,
          this.props.selectedTags,
          this.props.isSameTag
        ))
      }
    })
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
  }

  handleTextInput = (event) => {
    const text = event.target.value
    this.props.handleTextInput(text)
    if (text.length) {
      _.debounce(() => {
        this.helper
        .setQuery(text)
        .search()
      }, 300)()
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.addTag(e, this.props.inputText)
    }
  }

  render() {
    const {selectedTags, handleTagRemove, type} = this.props

    const renderedTiles = selectedTags.map((tag) => {
      return (
        <Tile
          key={tag.id ? tag.id : tag.title}
          text={tag.title}
          handleTagRemove={handleTagRemove}
        />
      )
    })

    const placeholder = `Add ${type === 'hashtag' ? 'hashtags' : 'categories'}`

    return (
      <StyledGrid>
        <VerticallyCenterRow>
          {!!renderedTiles.length &&
            <TilesWrapper>
              {renderedTiles}
            </TilesWrapper>
          }
          <InputWrapper>
            <StyledInput
              type='text'
              placeholder={placeholder}
              value={this.props.inputText}
              onChange={this.handleTextInput}
              onClick={this.props.inputOnClick}
              onKeyPress={this.handleKeyPress}
            />
          </InputWrapper>
          {
            this.props.children
          }
        </VerticallyCenterRow>
      </StyledGrid>
    )
  }
}
