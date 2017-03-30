import _ from 'lodash'
import React, {Component} from 'react'
import {
  ScrollView,
  View,
  Text,
  ListView,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native'
import {connect} from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import CategoryActions from '../../Redux/Entities/Categories'
import StoryActions from '../../Redux/Entities/Stories'
import CategoryFeedScreen from '../Explore/CategoryFeedScreen'
import ExploreGrid from '../../Components/ExploreGrid'
import StorySearchList from '../../Components/StorySearchList'
import styles from '../Styles/ExploreScreenStyles'

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
      text: null,
      selectedTabIndex: 0
    }
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.attemptGetUserFeed(this.props.user.id)
  }

  renderSearchSection() {
    return (
      <View style={styles.tabs}>
        <View style={styles.tabnav}>
          <Tab
            selected={this.state.selectedTabIndex === 0}
            onPress={() => this.setState({selectedTabIndex: 0})}
            text='STORIES'
          />
          <Tab
            selected={this.state.selectedTabIndex === 1}
            onPress={() => this.setState({selectedTabIndex: 1})}
            text='PEOPLE'
          />
        </View>
        {this.props.stories && this.props.stories.length > 0 && this.state.selectedTabIndex === 0 &&
          <ScrollView>
            <StorySearchList
              stories={this.props.stories}
              height={70}
              titleStyle={styles.storyTitleStyle}
              subtitleStyle={styles.subtitleStyle}
              forProfile={true}
              onPressStory={story => alert(`Story ${story.id} pressed`)}
              onPressLike={story => alert(`Story ${story.id} liked`)}
            />
          </ScrollView>
        }
      </View>
    )
  }

  render () {
    let content

    if (this.props.categoriesFetchStatus.loaded && !this.state.text) {
      content = (
        <ExploreGrid
          onPress={(category) => {
            NavActions.explore_categoryFeed({
              categoryId: category.id,
              title: category.title
            })
          }}
          categories={_.values(this.props.categories)}
        />
      )

    } else if (this.state.text) {
      content = this.renderSearchSection()
    } else {
      content = (
        <Text>No categories yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.headerSearch}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder='Search'
              placeholderTextColor='#757575'
              onChangeText={(text) => this.setState({text})}
            />
          </View>
        </View>
        {!this.state.text &&
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
    fetchStatus: storiesFetchStatus,
    entities: stories,
    error: storiesError
  } = state.entities.stories;
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
    error: categoriesError
  } = state.entities.categories;

  return {
    user: state.session.user,
    categories,
    stories,
    categoriesFetchStatus,
    storiesFetchStatus,
    error: categoriesError || storiesError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    attemptGetUserFeed: (userId) => {
      return dispatch(StoryActions.feedRequest(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen)
