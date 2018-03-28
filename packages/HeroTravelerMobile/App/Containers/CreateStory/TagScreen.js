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
import { Actions as NavActions } from 'react-native-router-flux'
import {connect} from 'react-redux'
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper';

import NavBar from '../CreateStory/NavBar'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'

import env from '../../Config/Env'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const CATEGORY_INDEX = env.SEARCH_CATEGORIES_INDEX

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import { Metrics, Colors } from '../../Shared/Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loader from '../../Components/Loader'
import styles from './TagScreenStyles'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import UserActions from '../../Shared/Redux/Entities/Users'

class TagScreen extends Component {

  static propTypes = {
    categories: PropTypes.array,
    onDone: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.props.loadDefaultCategories()
    this.state = {
      selectedCategories: props.categories || [],
      text: '',
      searching: false,
      searchResults: null,
      isInputFocused: false,
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, CATEGORY_INDEX)
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
    this.props.onDone(this.state.selectedCategories)
  }

  _selectDefaultCategory = (mongoCategory) => {
    this.setState({
      selectedCategories: [
        ...this.state.selectedCategories,
        {_id: mongoCategory.id, title: mongoCategory.title}
      ]
    })
  }

  _selectSearchCategory = (searchCategory) => {
    this.setState({
      text: '',
      selectedCategories: [
        ...this.state.selectedCategories,
        {_id: searchCategory._id, title: searchCategory.title}
      ]
    })
  }

  _removeCategory = (category) => {
    this.setState({
      selectedCategories: _.filter(this.state.selectedCategories, c => {
        return c._id !== category._id || c.title !== category.title
      })
    })
  }

  _addNewCategory = () => {

    if (_.size(_.trim(this.state.text)) === 0) {
      return
    }

    // This strips everything done into real words, no special characters, etc.
    const formattedTitle = _.map(_.words(this.state.text), _.upperFirst).join(' ')

    const existingMongoCategory = _.find(this.props.defaultCategories, c => {
      return c.title === formattedTitle
    })

    const existingSearchCategory = _.find(this.getSearchHits(), c => {
      return c.title === formattedTitle
    })

    // Use existing categories if the match one
    if (existingMongoCategory) {
      return this._selectDefaultCategory(existingMongoCategory)
    } else if (existingSearchCategory) {
      return this._selectSearchCategory(existingSearchCategory)
    }

    this.setState({
      selectedCategories: [
        ...this.state.selectedCategories,
        {title: formattedTitle}
      ],
      text: ''
    }, () => {
      this.refs.input.focus()
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
      name: TooltipTypes.STORY_CREATE_CATEGORIES,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  renderTooltip() {
    return (
      <TouchableOpacity
        style={styles.tooltipWrapper}
        onPress={this._completeTooltip}
      >
        <View style={styles.tooltipTextView}>
          <Text>Enter your own category or pick from below</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {

    const defaultCategoriesToShow = _.filter(this.props.defaultCategories, c => {
      return !_.includes(_.map(this.state.selectedCategories, '_id'), c._id)
    })

    let showTooltip = false
    if (this.props.user) {
      showTooltip = !isTooltipComplete(
        TooltipTypes.STORY_CREATE_CATEGORIES,
        this.props.user.introTooltips
      )
    }

    const searchResultsToShow = _.filter(this.getSearchHits(), c => {
      return !_.includes(_.map(this.state.selectedCategories, '_id'), c._id)
    })
    const isInputFocused = this.state.isInputFocused
    return (
      <View style={styles.root}>
        {showTooltip && this.renderTooltip()}
        <NavBar
          onLeft={NavActions.pop}
          leftTitle={'Cancel'}
          title={'ADD CATEGORIES'}
          rightTitle={'Done'}
          onRight={this._done}
          isRightValid={true}
          rightTextStyle={storyCoverStyles.navBarRightTextStyle}
          style={storyCoverStyles.navBarStyle}
        />
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='input'
                style={styles.textInput}
                value={this.state.text}
                placeholder='Add Categories'
                onChangeText={text => this._inputChanged(text)}
                onSubmitEditing={this._addNewCategory}
                onFocus={this.setInputFocused}
                onBlur={this.setInputBlurred}
              />
            </View>
          </View>
          <ScrollView style={{flexGrow: 3}}>
          {/*
            Render the selected categories
          */}
          {_.size(this.state.selectedCategories) > 0 &&
            <View style={styles.selectedCategories}>
              {_.map(this.state.selectedCategories, c => {
                return (
                  <View key={c._id || c.title} style={styles.selectedCategoryRow}>
                    <TouchableOpacity onPress={() => this._removeCategory(c)} style={[styles.row, styles.rowSelected]}>
                      <Text>{c.title}</Text>
                      <Icon name='close' size={15} style={styles.removeCategoryIcon} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

          {this.state.searching &&
            <Loader style={styles.spinner} spinnerColor={Colors.blackoutTint} />
          }

          {/* Show search results when text is present */}
          {!this.state.searching && !!this.state.text && _.size(searchResultsToShow) > 0 &&
            <View style={styles.defaultCats}>
              {_.map(searchResultsToShow, c => {
                return (
                  <View key={c._id} style={styles.rowWrapper}>
                    <TouchableOpacity onPress={() => this._selectSearchCategory(c)} style={styles.row}>
                      <Text>{c.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

          {/* Show default categories from mongo */}
          {!this.state.text && _.size(defaultCategoriesToShow) > 0 &&
            <View style={styles.defaultCats}>
              {_.map(defaultCategoriesToShow, c => {
                return (
                  <View key={c._id} style={styles.rowWrapper}>
                    <TouchableOpacity onPress={() => this._selectDefaultCategory(c)} style={styles.row}>
                      <Text>{c.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default connect(
  state => ({
    user: state.entities.users.entities[state.session.userId],
    defaultCategories: state.entities.categories.entities,
    categoriesFetchStatus: state.entities.categories.fetchStatus
  }),
  dispatch => ({
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))

  })
)(TagScreen)
