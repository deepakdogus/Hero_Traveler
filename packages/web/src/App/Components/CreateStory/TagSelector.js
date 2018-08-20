import React, {Component} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  InputRowContainer,
  IconWrapper,
} from './StoryDetails'
import TagsTileGridAndInput from './TagsTileGridAndInput'
import TagPicker from './TagPicker'

const RelativePositionAncestor = styled.div`
  position: relative;
  width: 100px;
`

export default class TagSelector extends Component {
  static propTypes = {
    handleTagAdd: PropTypes.func,
    loadDefaultTags: PropTypes.func,
    handleTagRemove: PropTypes.func,
    updateTagsList: PropTypes.func,
    isSameTag: PropTypes.func,
    Icon: PropTypes.func,
    iconName: PropTypes.string,
    selectedTags: PropTypes.arrayOf(PropTypes.object),
    tagsList: PropTypes.arrayOf(PropTypes.object),
  }

  state = {
    isPickerOpen: false
  }

  togglePicker = () => this.setState({isPickerOpen: !this.state.isPickerOpen})

  getType = () => this.props.iconName === 'hashtag' ? 'hashtags' : 'categories'

  _handleTagAdd = (event, tag) => {
    this.props.handleTagAdd(event, tag, this.getType())
    this.setState({inputText: ''})
  }

  _handleTagRemove = (event, tagTitle) => {
    this.props.handleTagRemove(event, tagTitle, this.getType())
  }

  handleCategoryInputTextChange = (text) => {
    this.setState({
      inputText: text,
    })
    if (!text.length) {
      this.props.loadDefaultTags()
    }
  }

  render() {
    const {
      Icon,
      iconName,
      selectedTags,
      updateTagsList,
      tagsList,
      isSameTag,
      loadDefaultTags
    } = this.props
    const {isPickerOpen, inputText} = this.state

    return (
      <InputRowContainer>
        <IconWrapper>
          <Icon name={iconName}/>
        </IconWrapper>
        <TagsTileGridAndInput
          selectedTags={selectedTags}
          handleTagRemove={this._handleTagRemove}
          inputOnClick={this.togglePicker}
          addTag={this._handleTagAdd}
          updateTagsList={updateTagsList}
          inputText={inputText}
          handleTextInput={this.handleCategoryInputTextChange}
          isSameTag={isSameTag}
          type={iconName}
        >
        {
          isPickerOpen &&
          <RelativePositionAncestor>
            <TagPicker
              closePicker={this.togglePicker}
              handleTagSelect={this._handleTagAdd}
              tagsList={tagsList}
              loadDefaultTags={loadDefaultTags}
            />
          </RelativePositionAncestor>
        }
        </TagsTileGridAndInput>
      </InputRowContainer>
    )
  }
}
