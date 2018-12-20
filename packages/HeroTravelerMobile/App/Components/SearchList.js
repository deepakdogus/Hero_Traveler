import _ from 'lodash'
import React, { Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
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

const MAX_ITEMS = 5

class SearchList extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number,
    lastSearchResults: PropTypes.object,
    lastLocationPredictions: PropTypes.array,
    isSearching: PropTypes.bool,
    isSearchingLocation: PropTypes.bool,
    userId: PropTypes.string,
    query: PropTypes.string,
    addRecentSearch: PropTypes.func,
  }

  _navToSearchResults = location => () => {
    // add to recent search
  }

  _navToStory = story => () => {
    // add to recent search
    NavActions.story({
      storyId: story._id,
      title: this.props.query,
    })
  }

  _navToUserProfile = user => () => {
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

  renderLocationRow = location => {
    return (
      <ListItem
        onPress={this._navToSearchResults(location)}
        text={<Text style={styles.listItemText}>{location.primaryText}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPlacesRow = story => {
    return (
      <ListItem
        onPress={this._navToStory(story)}
        text={<Text style={styles.listItemText}>{story.title}</Text>}
        style={styles.searchRowItem}
      />
    )
  }

  renderPeopleRow = user => {
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

  renderSearchTitle = text => (
    <View style={styles.searchTitleWrapper}>
      <Text style={styles.searchTitleText}>{text}</Text>
    </View>
  )

  render = () => {
    const {
      isSearching,
      isSearchingLocation,
      selectedTabIndex,
      lastSearchResults,
      lastLocationPredictions,
    } = this.props
    const searchHits = _.get(lastSearchResults, 'hits', []).slice(0, MAX_ITEMS)
    const locationHits = lastLocationPredictions || []

    return (
      <View style={styles.scrollWrapper}>
        {(isSearching || isSearchingLocation) && <Loader style={styles.searchLoader} />}
        {selectedTabIndex === 0 &&
          <ScrollView>
            {!!locationHits.length && (
              <Fragment>
                {this.renderSearchTitle('LOCATIONS')}
                <List
                  items={lastLocationPredictions}
                  renderRow={this.renderLocationRow}
                />
              </Fragment>
            )}
            {!!searchHits.length && (
              <Fragment>
                {this.renderSearchTitle('STORIES')}
                <List
                  items={searchHits}
                  renderRow={this.renderPlacesRow}
                />
              </Fragment>
            )}
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
        {selectedTabIndex === 0
          && !isSearching
          && !isSearchingLocation
          && !searchHits.length
          && !locationHits.length
          && (
            <Text style={styles.noFindText}>No results</Text>
        )}
        {!isSearching && searchHits.length === 0 && selectedTabIndex === 1 &&
          <Text style={styles.noFindText}>No users found</Text>
        }
      </View>
    )
  }
}

export default SearchList
