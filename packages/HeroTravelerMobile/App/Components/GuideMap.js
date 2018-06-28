import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
} from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps'
import memoize from 'memoize-one'
import {Actions as NavActions} from 'react-native-router-flux'

import ImageWrapper from './ImageWrapper'
import {getStoryImageUrl} from './GuideStoriesOfType'
import styles from './Styles/GuideMapStyles'
import {storyWidth} from './Styles/GuideStoriesOfTypeStyles'
import {displayLocation} from '../Shared/Lib/locationHelpers'

const videImageOptions = {
  video: true,
  width: storyWidth / 2
}

class GuideMap extends Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.stories.length !== this.props.stories.length
      || this.hasDifferentStories(prevProps.stories, this.props.stories)
    ) {
      this.onLayout()
    }
  }

  hasDifferentStories(oldStories, newStories) {
    return oldStories.some((story, index) => {
      return story.id !== newStories[index].id
    })
  }

  // this will find the center of the coords and their span
  getStoriesRegion = memoize(
    (storiesLatLng) => {
      const numStories = storiesLatLng.length
      const center = storiesLatLng.reduce((latLng, story) => {
        latLng.latitude += story.latitude / numStories
        latLng.longitude += story.longitude / numStories
        return latLng
      }, {latitude: 0, longitude: 0})

      // takig default values from StoryReadingScreens map in case there is only one story.
      let maxLatitudeDelta = 0.0922
      let maxLongitudeDelta = 0.0421
      storiesLatLng.forEach(story =>{
        maxLatitudeDelta = Math.max(
          maxLatitudeDelta,
          Math.abs(center.latitude - story.latitude)
        )
        maxLongitudeDelta = Math.max(
          maxLongitudeDelta,
          Math.abs(center.longitude - story.longitude)
        )
      })

      const storiesRegion = {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: maxLatitudeDelta,
        longitudeDelta: maxLongitudeDelta,
      }
      return storiesRegion
    }
  )

  onPressStory = (story) => {
    return () => NavActions.story({
      storyId: story._id,
      title: displayLocation(story.locationInfo),
    })
  }

  renderStoryPins = () => {
    return this.props.stories.map(story => {
      const coverUrl = getStoryImageUrl(story, videImageOptions)
      return (
        <Marker
          key={story.id}
          coordinate={{
            latitude: story.locationInfo.latitude,
            longitude: story.locationInfo.longitude,
          }}
          fitToElements={{animated: true}}
        >
          <Callout onPress={this.onPressStory(story)}>
            <View style={styles.calloutView}>
              <ImageWrapper
                cached
                source={{uri: coverUrl}}
                style={styles.image}
              />
              <Text style={styles.title}>
                {story.title}
              </Text>
            </View>
          </Callout>
        </Marker>
      )
    })
  }

  setMapViewRef = (ref) => this.mapViewRef = ref

  onLayout = () => {
    if (!this.mapViewRef) return
    this.mapViewRef.fitToCoordinates(
      this.getStoriesCoordinates(),
      {
        edgePadding: {top: 40, right: 40, bottom: 40, left: 40},
      }
    )
  }

  getStoriesCoordinates = () => {
    return this.props.stories.map(story => {
      return {
        latitude: story.locationInfo.latitude,
        longitude: story.locationInfo.longitude,
      }
    })
  }

  render() {
    return (
      <MapView
        ref={this.setMapViewRef}
        style={styles.mapView}
        initialRegion={this.getStoriesRegion(this.getStoriesCoordinates())}
        onLayout={this.onLayout}
      >
        {this.renderStoryPins()}
      </MapView>
    )
  }
}

export default GuideMap
