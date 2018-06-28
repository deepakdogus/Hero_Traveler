import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps'
import memoize from 'memoize-one'

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

  renderStoryPins = () => {
    return this.props.stories.map(story => {
      return (
        <MapView.Marker
          key={story.id}
          coordinate={{
            latitude: story.locationInfo.latitude,
            longitude: story.locationInfo.longitude,
          }}
          fitToElements={{animated: true}}
        />
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
        style={{height: 400}}
        initialRegion={this.getStoriesRegion(this.getStoriesCoordinates())}
        onLayout={this.onLayout}
      >
        {this.renderStoryPins()}
      </MapView>
    )
  }
}

export default GuideMap
