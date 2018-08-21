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


const WrapperCol = styled(Col)`
  margin: 5px 10px;
`

const InputWrapper = styled(Col)`
  display: flex;
  flex-direction: 'column';
  justify-content: 'center';
  margin: 10px 0px;
`

const TextTile = styled(Row)`
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
`

class Tile extends React.Component {
  static propTypes = {
    tag: PropTypes.object,
    handleTagRemove: PropTypes.func
  }

  _handleTagRemove = (event) => {
    const {tag, handleTagRemove} = this.props
    handleTagRemove(event, tag.title)
  }

  render() {
    const {tag} = this.props
    return (
      <WrapperCol key={tag.id ? tag.id : tag.title}> {/* Tags do not yet have ids if they have just been entered by user*/}
        <TextTile around='xs'>
          <TagText>{tag.title}</TagText>
          <StyledIcon
            data-tagName={tag.id}
            name='closeDark'
            onClick={this._handleTagRemove}
          />
        </TextTile>
      </WrapperCol>
    )
  }
}

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
          tag={tag}
          handleTagRemove={handleTagRemove}
        />
      )
    })

    const placeholder = `Add ${type === 'hashtag' ? 'Hashtags' : 'Categories'}`

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