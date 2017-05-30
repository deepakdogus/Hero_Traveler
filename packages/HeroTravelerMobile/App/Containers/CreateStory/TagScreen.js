import _ from 'lodash'
import React, {Component, PropTypes} from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
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

import CategoryActions from '../../Redux/Entities/Categories'
import {Metrics, Fonts, Colors} from '../../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loader from '../../Components/Loader'

const S = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: Metrics.baseMargin,
    flexDirection: 'column'
  },
  content: {
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  doneBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    justifyContent: 'flex-end'
  },
  doneBtnText: {
    fontFamily: Fonts.type.montserrat
  },
  textInput: {
    flex: 1,
    height: 30,
  },
  textInputWrapper: {
    flex: .7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    marginVertical: Metrics.baseMargin / 2
  },
  row: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas
  },
  selectedCategoryRow: {
    backgroundColor: Colors.lightGreyAreas,
    marginBottom: Metrics.baseMargin / 5,
  },
  removeCategoryIcon: {
    marginTop: 2,
    color: Colors.background
  },
  formWrapper: {
    flexDirection: 'row',
    flex: 1
  },
  addBtn: {
    flex: .3,
    height: 30,
    // marginLeft: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  addText: {
    top: 2,
  },
  spinner: {
    margin: Metrics.section
  }
})

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
      <ScrollView style={S.root}>
        <TouchableOpacity style={S.doneBtn} onPress={this._done}>
          <Text style={S.doneBtnText}>Done</Text>
        </TouchableOpacity>
        <View style={S.content}>
          <View style={S.formWrapper}>
            <View style={S.textInputWrapper}>
              <TextInput
                ref='input'
                style={S.textInput}
                value={this.state.text}
                placeholder='Type...'
                onChangeText={text => this._inputChanged(text)}
                onSubmitEditing={this._addNewCategory}
              />
            </View>
            {!!this.state.text &&
              <TouchableOpacity onPress={() => this._addNewCategory()}>
                <View style={S.addBtn}>
                  <Text style={S.addText}>Add</Text>
                </View>
              </TouchableOpacity>
            }
          </View>

          {/*
            Render the selected categories
          */}
          {_.size(this.state.selectedCategories) > 0 &&
            <View style={S.selectedCategories}>
              {_.map(this.state.selectedCategories, c => {
                return (
                  <View key={c._id || c.title} style={S.selectedCategoryRow}>
                    <TouchableOpacity onPress={() => this._removeCategory(c)} style={[S.row, S.rowSelected]}>
                      <Text>{c.title}</Text>
                      <Icon name='close' size={15} style={S.removeCategoryIcon} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

          {this.state.searching &&
            <Loader style={S.spinner} spinnerColor={Colors.blackoutTint} />
          }

          {/* Show search results when text is present */}
          {!this.state.searching && !!this.state.text && _.size(searchResultsToShow) > 0 &&
            <View style={S.defaultCats}>
              {_.map(searchResultsToShow, c => {
                return (
                  <View key={c._id} style={S.rowWrapper}>
                    <TouchableOpacity onPress={() => this._selectSearchCategory(c)} style={S.row}>
                      <Text>{c.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

          {/* Show default categories from mongo */}
          {!this.state.text && _.size(defaultCategoriesToShow) > 0 &&
            <View style={S.defaultCats}>
              {_.map(defaultCategoriesToShow, c => {
                return (
                  <View key={c._id} style={S.rowWrapper}>
                    <TouchableOpacity onPress={() => this._selectDefaultCategory(c)} style={S.row}>
                      <Text>{c.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }

        </View>
      </ScrollView>
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
