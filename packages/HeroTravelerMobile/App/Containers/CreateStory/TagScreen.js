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
const CATEGORY_INDEX = env.SEARCH_CATEGORIES_INDEX

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import { Metrics, Colors } from '../../Shared/Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loader from '../../Components/Loader'
import styles from './TagScreenStyles'

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

  componentDidMount() {
    this.refs.input.focus()
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
    helper = this.helper

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

  render () {

    const defaultCategoriesToShow = _.filter(this.props.defaultCategories, c => {
      return !_.includes(_.map(this.state.selectedCategories, '_id'), c._id)
    })

    const searchResultsToShow = _.filter(this.getSearchHits(), c => {
      return !_.includes(_.map(this.state.selectedCategories, '_id'), c._id)
    })

    return (
      <View style={styles.root}>
        <View style={{marginTop: Metrics.baseMargin, height: 40}}>
          <TouchableOpacity style={styles.doneBtn} onPress={this._done}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='input'
                style={styles.textInput}
                value={this.state.text}
                placeholder='Add Tags'
                onChangeText={text => this._inputChanged(text)}
                onSubmitEditing={this._addNewCategory}
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
    defaultCategories: state.entities.categories.entities,
    categoriesFetchStatus: state.entities.categories.fetchStatus
  }),
  dispatch => ({
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest())
  })
)(TagScreen)
