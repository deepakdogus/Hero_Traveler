import _ from 'lodash'
import React, {Component} from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import env from '../../Config/Env'
import Icon from 'react-native-vector-icons/FontAwesome'
// Search
import algoliasearchModule from 'algoliasearch/reactnative'
import AlgoliaSearchHelper from 'algoliasearch-helper';

import CategoryActions from '../../Shared/Redux/Entities/Categories'
import Loader from '../../Components/Loader'
import ExploreGrid from '../../Components/ExploreGrid'
import styles, {CategoryFeedNavActionStyles} from '../Styles/ExploreScreenStyles'
import Colors from '../../Shared/Themes/Colors'
import List from '../../Components/List'
import ListItem from '../../Components/ListItem'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import Avatar from '../../Components/Avatar'
import ImageWrapper from '../../Components/ImageWrapper'
import {PlayButton} from '../../Components/VideoPlayer'
import TabIcon from '../../Components/TabIcon'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const USERS_INDEX = env.SEARCH_USER_INDEX

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

class ExploreScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastSearchResults: null,
      selectedTabIndex: null
    }
  }

  componentWillMount() {
    this.helper = AlgoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        searching: false,
        lastSearchResults: res,
      })
    })
    helper.on('search', () => {
      this.setState({searching: true})
    })
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  getSearchIndex(selectedTabIndex) {
    return selectedTabIndex === 0 ? STORY_INDEX : USERS_INDEX
  }

  changeIndex(newIndex) {
    this.removeSearchListeners(this.helper)
    this.helper = this.helper.setIndex(newIndex)
    this.setupSearchListeners(this.helper)
    return this.helper
  }

  _changeQuery = (e) => {
    const helper = this.helper
    const q = e.nativeEvent.text
    const hasSearchText = q.length > 0
    if (this.state.selectedTabIndex === null) {
      this.setState({
        selectedTabIndex: 0,
        hasSearchText
      })
    }

    if (_.isString(q) && q.length === 0) {
      this.setState({
        lastSearchResults: null,
        searching: false,
        hasSearchText
      })
      return
    } else if (_.isString(q) && q.length < 3) {
      if (hasSearchText && !this.state.hasSearchText) {
        this.setState({hasSearchText})
      }
      return
    }

    _.debounce(() => {
      helper
        .setQuery(q)
        .search()
    }, 300)()
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  _changeTab = (selectedTabIndex) => {
    this.changeIndex(this.getSearchIndex(selectedTabIndex))
    const textValue = this._searchInput._lastNativeText;
    if (textValue && textValue.length >= 3) {
      this.setState({
        searching: true,
        selectedTabIndex,
        lastSearchResults: null,
      })
      this.helper.search()
    }
    else {
      this.setState({selectedTabIndex, lastSearchResults: null})
    }
  }

  setFocus = () => {
    if (this.state.selectedTabIndex === null) this.setState({selectedTabIndex: 0})
  }

  checkClearResults = (text) => {
    if (text.length <= 2) {
      this.setState({lastSearchResults: null})
    }
  }

  resetSearchText = () => {
    this._searchInput.setNativeProps({text: ''})
    this.setState({hasSearchText: false})
  }

  renderSearchSection() {
    let searchHits = _.get(this.state.lastSearchResults, 'hits', [])
    const isSearching = this.state.searching
    return (
      <View style={styles.tabs}>
        <View style={styles.tabnav}>
          <Tab
            selected={this.state.selectedTabIndex === 0}
            onPress={() => this._changeTab(0)}
            text='STORIES'
          />
          <Tab
            selected={this.state.selectedTabIndex === 1}
            onPress={() => this._changeTab(1)}
            text='PEOPLE'
          />
        </View>
        <View style={styles.scrollWrapper}>
        {isSearching && <Loader style={styles.searchLoader} />}
        {searchHits.length > 0 && this.state.selectedTabIndex === 0 &&
          <ScrollView>
            <List
              items={searchHits}
              renderRow={(story) => {
                let leftEl

                if (story.coverImage) {
                  leftEl = (
                    <ImageWrapper
                      cached={true}
                      resizeMode='cover'
                      source={{uri: getImageUrl(story.coverImage, 'basic')}}
                      style={styles.thumbnailImage}
                    />
                  )
                } else {
                  leftEl = (
                    <View style={styles.videoCoverWrapper}>
                      <ImageWrapper
                        cached={true}
                        resizeMode='cover'
                        source={{uri: getImageUrl(story.coverVideo, 'video', {video: true})}}
                        style={styles.thumbnailImage}
                      >
                      </ImageWrapper>
                      <PlayButton
                        size='tiny'
                        style={styles.PlayButton}
                      />
                    </View>
                  )
                }

                return (
                  <ListItem
                    onPress={() => NavActions.story({
                      storyId: story._id,
                      title: this.helper.state.query,
                    })}
                    leftElement={leftEl}
                    text={<Text style={styles.listItemText}>{story.title}</Text>}
                    secondaryText={<Text style={styles.listItemTextSecondary}>{story.author}</Text>}
                    rightElement={<Icon name='angle-right' color={Colors.whiteAlphaPt3} size={30} />}
                  />
                )
              }}
            />
          </ScrollView>
        }
        {searchHits.length > 0 && this.state.selectedTabIndex === 1 &&
          <ScrollView>
            <List
              items={searchHits}
              renderRow={(user) => {
                return (
                  <ListItem
                    onPress={() => {
                      if (user._id === this.props.user.id) {
                        NavActions.profile({type: 'jump'})
                      } else {
                        NavActions.readOnlyProfile({
                          userId: user._id
                        })
                      }
                    }}
                    leftElement={
                      <Avatar
                        avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
                        iconColor={Colors.lightGreyAreas}
                      />
                    }
                    text={<Text style={styles.listItemText}>{user.profile.fullName}</Text>}
                    rightElement={<Icon name='angle-right' color={Colors.whiteAlphaPt3} size={30} />}
                  />
                )
              }}
            />
          </ScrollView>
        }
        {!isSearching && searchHits.length === 0 && this.state.selectedTabIndex === 0 &&
          <Text style={styles.noFindText}>No stories found</Text>
        }
        {!isSearching && searchHits.length === 0 && this.state.selectedTabIndex === 1 &&
          <Text style={styles.noFindText}>No users found</Text>
        }
        </View>
      </View>
    )
  }

  render () {
    const {categories = {}, categoriesFetchStatus} = this.props
    let content

    const showSearch = this.state.lastSearchResults || this.state.selectedTabIndex !== null
    const catagoriesArray = _.values(categories)

    if (categoriesFetchStatus.fetching && !catagoriesArray.length) {
      content = (
        <Loader style={styles.loader} />
      )
    } else if (showSearch) {
      content = this.renderSearchSection()
    } else {
      content = (
        <ExploreGrid
          onPress={(category) => {
            NavActions.explore_categoryFeed({
              categoryId: category.id,
              title: category.title,
              leftButtonIconStyle: CategoryFeedNavActionStyles.leftButtonIconStyle,
              navigationBarStyle: CategoryFeedNavActionStyles.navigationBarStyle,
            })
          }}
          categories={catagoriesArray}
        />
      )
    }

    return (
      <ScrollView style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.headerSearch}>
          <View style={styles.searchWrapper}>
            <TextInput
              ref={c => this._searchInput = c}
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onFocus={this.setFocus}
              onChange={e => this._changeQuery(e)}
              onChangeText={this.checkClearResults}
              returnKeyType='search'
            />
            { this.state.hasSearchText &&
            <TouchableOpacity
              style={styles.InputXPosition}
              onPress={this.resetSearchText}
            >
              <TabIcon
                name='closeDark'
                style={{
                  view: styles.InputXView,
                  image: styles.InputXIcon,
                }}
              />
            </TouchableOpacity>
            }
          </View>
          {this.state.selectedTabIndex !== null &&
            <TouchableOpacity onPress={() => {
              this._searchInput.setNativeProps({text: ''})
              this.setState({selectedTabIndex: null, lastSearchResults: null})
            }}>
              <View style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
        {!showSearch &&
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>EXPLORE</Text>
          </View>
        }
        {content}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
    error: categoriesError
  } = state.entities.categories;

  return {
    user: state.entities.users.entities[state.session.userId],
    users: state.entities.users.entities,
    categories,
    categoriesFetchStatus,
    error: categoriesError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
