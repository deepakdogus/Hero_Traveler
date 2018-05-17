import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper';

import env from '../../Config/Env'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import HashtagActions from '../../Shared/Redux/Entities/Hashtags'
import { Metrics, Colors } from '../../Shared/Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loader from '../../Components/Loader'
import styles from './TagScreenStyles'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import UserActions from '../../Shared/Redux/Entities/Users'
import Tooltip from '../../Components/Tooltip'
import TagRow from '../../Components/TagRow'

export const TAG_TYPE_CATEGORY = "category";
export const TAG_TYPE_HASHTAG = "hashtag";

class TagScreen extends Component {

  static propTypes = {
    tagType: PropTypes.oneOf([TAG_TYPE_CATEGORY, TAG_TYPE_HASHTAG]).isRequired,
    tags: PropTypes.array,
    onDone: PropTypes.func.isRequired,
    defaultCategories: PropTypes.object,
    defaultHashtags: PropTypes.object,
    loadDefaultCategories: PropTypes.func,
    loadDefaultHashtags: PropTypes.func,
    user: PropTypes.object,
    completeTooltip: PropTypes.func,
  }

  constructor(props) {
    super(props)

    switch(props.tagType) {
      case TAG_TYPE_CATEGORY:
        this.props.loadDefaultCategories()
        this.tagIndex = env.SEARCH_CATEGORIES_INDEX;
        break;
      case TAG_TYPE_HASHTAG:
        this.props.loadDefaultHashtags()
        this.tagIndex = env.SEARCH_HASHTAGS_INDEX;
        break;
      default:
        throw new Error("No tag type supplied to the TagScreen")
    }

    this.state = {
      selectedTags: props.tags || [],
      text: '',
      searching: false,
      searchResults: null,
      isInputFocused: false,
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, this.tagIndex)
    this.setupSearchListeners(this.helper)
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        searching: false,
        searchResults: res,
      })
    })
    helper.on('search', () => {
      this.setState({searching: true})
    })
  }

  removeSearchListeners() {
    this.helper.removeAllListeners('result')
    this.helper.removeAllListeners('search')
  }

  componentWillUnmount() {
    this.removeSearchListeners()
  }

  _done = () => {
    this.props.onDone(this.state.selectedTags)
  }

  _selectTag = (tag) => {
    const isSearchTag = !tag.image
     if (this._checkExistingTag(tag.title)) {
      if (isSearchTag) this.setInputBlurred();
      return;
    }

    const updatedState = {
      selectedTags: [
        ...this.state.selectedTags,
        {_id: tag._id, title: tag.title}
      ]
    }
    updatedState.text = ''
    this.setState(updatedState, () => {
      // This is a fix for search results disappearing as soon as the
      // TextInput is blurred.
      if (isSearchTag) this.setInputBlurred();
    })
  }

  _selectDefaultTag = (mongoTag) => {
    if (this._checkExistingTag(mongoTag.title)) {
      return;
    }

    this.setState({
      selectedTags: [
        ...this.state.selectedTags,
        {_id: mongoTag.id, title: mongoTag.title}
      ]
    })
  }

  _selectSearchTag = (searchTag) => {
    if (this._checkExistingTag(searchTag.title)) {
      this.setInputBlurred();
      return;
    }

    this.setState({
      text: '',
      selectedTags: [
        ...this.state.selectedTags,
        {_id: searchTag._id, title: searchTag.title}
      ]
    }, () => {
      // This is a fix for search results disappearing as soon as the
      // TextInput is blurred.
      this.setInputBlurred();
    })
  }

  _removeTag = (tag) => {
    this.setState({
      selectedTags: _.filter(this.state.selectedTags, t => {
        return t._id !== tag._id || t.title !== tag.title
      })
    })
  }

  // We can not cache these as they might change in the reducer, so we have to set up some kind of a getter.
  _getDefaultTags = () => {
    if (this.props.tagType === TAG_TYPE_CATEGORY) {
      return this.props.defaultCategories;
    } else if (this.props.tagType === TAG_TYPE_HASHTAG) {
      return this.props.defaultHashtags;
    } else {
      throw new Error("Invalid tag type to get defaults: ", this.props.tagType);
    }
  }

  _formatTag = (title) => {
    if (this.props.tagType === TAG_TYPE_CATEGORY) {
      return _.map(_.words(title), _.upperFirst).join(' ');
    } else if (this.props.tagType === TAG_TYPE_HASHTAG) {
      return _.map(_.words(title.replace(/#/g, "")), _.lowerCase).join('-');
    } else {
      throw new Error("Invalid tag type to get defaults: ", this.props.tagType);
    }
  }

  _checkExistingTag(title) {
    for (let selectedTag of this.state.selectedTags) {
      if (selectedTag.title === title) {
        return true;
      }
    }
    return false;
  }

  _addNewTag = () => {

    if (_.size(_.trim(this.state.text)) === 0) {
      return
    }

    // This strips everything done into real words, no special characters, etc.
    const formattedTitle = this._formatTag(this.state.text);

    // Do not duplicate if we already have this tag in out selected tags.
    if (this._checkExistingTag(formattedTitle)) {
      return;
    }

    const existingMongoTag = _.find(this._getDefaultTags(), t => {
      return t.title === formattedTitle
    })

    const existingSearchTag = _.find(this.getSearchHits(), t => {
      return t.title === formattedTitle
    })

    // Use existing categories if the match one
    if (existingMongoTag) {
      return this._selectDefaultTag(existingMongoTag);
    } else if (existingSearchTag) {
      return this._selectSearchTag(existingSearchTag);
    }

    this.setState({
      selectedTags: [
        ...this.state.selectedTags,
        {title: formattedTitle}
      ],
      text: ''
    }, () => {
      this.setInputBlurred();
    })
  }

  _inputChanged = (text) => {
    const helper = this.helper

    this.setState({text}, () => {
      if (_.isString(text) && text.length === 0) {
        setTimeout(() => {
          this.setState({
            searchResults: null,
            searching: false
          })
        }, 1000)
        return
      }

      _.debounce(() => {
        helper
          .setQuery(text)
          .search()
      }, 500)()
    })
  }

  getSearchHits() {
    return _.get(this.state.searchResults, 'hits', [])
  }

  setInputFocused = () => {
    this.setState({isInputFocused: true})
  }

  setInputBlurred = () => {
    this.setState({isInputFocused: false, text: ''}, () => {
      this.refs.input.blur()
    })
  }

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: this._getTagTypeTooltipType(),
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  _getTagTypeText = (plural) => {
    if (plural) {
      return (this.props.tagType === TAG_TYPE_CATEGORY) ? "categories" : "hashtags";
    } else {
      return (this.props.tagType === TAG_TYPE_CATEGORY) ? "category" : "hashtag";
    }
  }

  _getTagTypeTooltipType = () => {
    return (this.props.tagType === TAG_TYPE_CATEGORY) ? TooltipTypes.STORY_CREATE_CATEGORIES : TooltipTypes.STORY_CREATE_HASHTAGS;
  }

  renderTagRow = (tag) => {
    return (
      <TagRow
        key={tag._id}
        tag={tag}
        tagType={this.props.tagType}
        onPress={this._selectTag}
      />
    )
  }

  render () {

    const defaultTagsToShow = _.filter(this._getDefaultTags(), t => {
      return !_.includes(_.map(this.state.selectedTags, '_id'), t._id)
    })

    let showTooltip = false
    if (this.props.user) {
      showTooltip = !isTooltipComplete(
        this._getTagTypeTooltipType(),
        this.props.user.introTooltips
      )
    }

    const searchResultsToShow = _.filter(this.getSearchHits(), t => {
      return !_.includes(_.map(this.state.selectedTags, '_id'), t._id)
    })

    const isShowSearchResults = !this.state.searching
      && !!this.state.text
      && _.size(searchResultsToShow) > 0
    const isShowDefaultResults = !this.state.text && _.size(defaultTagsToShow) > 0
    const tagsToShow = isShowSearchResults ? searchResultsToShow : defaultTagsToShow

    const isInputFocused = this.state.isInputFocused
    return (
      <View style={styles.root}>
        <View style={{marginTop: Metrics.baseMargin, height: 40}}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={isInputFocused ? this.setInputBlurred : this._done}
          >
            <Text style={styles.doneBtnText}>{isInputFocused ? 'Cancel' : 'Done'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='input'
                style={styles.textInput}
                value={this.state.text}
                placeholder={'Add ' + _.upperFirst(this._getTagTypeText(true))}
                onChangeText={this._inputChanged}
                onSubmitEditing={this._addNewTag}
                onFocus={this.setInputFocused}
                autoCorrect={this.props.tagType === TAG_TYPE_CATEGORY}
                // onBlur={this.setInputBlurred}
              />
            </View>
          </View>
          <ScrollView style={{flexGrow: 3}}>
          {/*
            Render the selected tags
          */}
          {_.size(this.state.selectedTags) > 0 &&
            <View style={styles.selectedTags}>
              {_.map(this.state.selectedTags, t => {
                return (
                  <View key={t._id || t.title} style={styles.selectedTagRow}>
                    <TouchableOpacity onPress={() => this._removeTag(t)} style={[styles.row, styles.rowSelected]}>
                      <Text>{this.props.tagType === TAG_TYPE_HASHTAG ? "#" : ""}{t.title}</Text>
                      <Icon name='close' size={15} style={styles.removeTagIcon} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

          {this.state.searching &&
            <Loader style={styles.spinner} spinnerColor={Colors.blackoutTint} />
          }
          {(isShowSearchResults || isShowDefaultResults) &&
            <View style={styles.defaultTags}>
              {_.map(tagsToShow, this.renderTagRow)}
            </View>
          }
          </ScrollView>
        </View>

        {showTooltip &&
          <Tooltip
            text={'Enter your own ' + this._getTagTypeText() + ' or pick from below'}
            style={{
              container: {top: 100, left: 20,},
              tip: {left: 20,},
            }}
            onDismiss={this._completeTooltip}
          />
        }

      </View>
    )
  }
}

export default connect(
  state => ({
    user: state.entities.users.entities[state.session.userId],
    defaultCategories: state.entities.categories.entities,
    defaultHashtags: state.entities.hashtags.entities,
  }),
  dispatch => ({
    loadDefaultHashtags: () => dispatch(HashtagActions.loadHashtagsRequest()),
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  })
)(TagScreen)
