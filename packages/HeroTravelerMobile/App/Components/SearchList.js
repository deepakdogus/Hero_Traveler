import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import Loader from './Loader'
import List from './List'
import ListItem from './ListItem'
import ImageWrapper from './ImageWrapper'
import { PlayButton } from './VideoPlayer'
import Avatar from './Avatar'

import getImageUrl from '../Shared/Lib/getImageUrl'
import styles from '../Containers/Styles/ExploreScreenStyles'
import Colors from '../Shared/Themes/Colors'

class SearchList extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number,
    lastSearchResults: PropTypes.object,
    isSearching: PropTypes.bool,
    userId: PropTypes.string,
    query: PropTypes.string,
  }

  _navToStory = story => () => NavActions.story({
    storyId: story._id,
    title: this.props.query,
  })

  _navToUserProfile = user => () => {
    console.log('RUNNING')
    if (user._id === this.props.userId) {
      NavActions.profile({type: 'jump'})
    }
    else {
      NavActions.readOnlyProfile({
        userId: user._id,
      })
    }
  }

  renderPlacesLeft = (story) => {
    if (story.coverImage) {
      return (
        <ImageWrapper
          cached={true}
          resizeMode='cover'
          source={{uri: getImageUrl(story.coverImage, 'basic')}}
          style={styles.thumbnailImage}
        />
      )
    }
    else {
      return (
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
  }

  renderPlacesRow = (story) => {
    return (
      <ListItem
        onPress={this._navToStory(story)}
        leftElement={this.renderPlacesLeft(story)}
        text={<Text style={styles.listItemText}>{story.title}</Text>}
        secondaryText={<Text style={styles.listItemTextSecondary}>{story.author}</Text>}
        rightElement={<Icon name='angle-right' color={Colors.whiteAlphaPt3} size={30} />}
      />
    )
  }

  renderPeopleRow = (user) => {
    return (
      <ListItem
        onPress={this._navToUserProfile(user)}
        leftElement={
          <Avatar
            avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
            iconColor={Colors.lightGreyAreas}
          />
        }
        text={<Text style={styles.listItemText}>{user.username}</Text>}
        rightElement={<Icon name='angle-right' color={Colors.whiteAlphaPt3} size={30} />}
      />
    )
  }

  render = () => {
    const { isSearching, selectedTabIndex, lastSearchResults } = this.props
    const searchHits = _.get(lastSearchResults, 'hits', [])
    return (
      <View style={styles.scrollWrapper}>
        {isSearching && <Loader style={styles.searchLoader} />}
        {searchHits.length > 0 && selectedTabIndex === 0 &&
          <ScrollView>
            <List
              items={searchHits}
              renderRow={this.renderPlacesRow}
            />
          </ScrollView>
        }
        {searchHits.length > 0 && selectedTabIndex === 1 &&
          <ScrollView>
            <List
              items={searchHits}
              renderRow={this.renderPeopleRow}
            />
          </ScrollView>
        }
        {!isSearching && searchHits.length === 0 && selectedTabIndex === 0 &&
          <Text style={styles.noFindText}>No stories found</Text>
        }
        {!isSearching && searchHits.length === 0 && selectedTabIndex === 1 &&
          <Text style={styles.noFindText}>No users found</Text>
        }
      </View>
    )
  }
}

export default SearchList
