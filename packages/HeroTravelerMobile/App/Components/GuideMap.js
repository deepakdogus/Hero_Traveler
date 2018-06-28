import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps';

class GuideMap extends Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
  }

  state = {
    initialRegion: undefined
  }

  // this will find the center of the coords and their span
  setInitialRegion = () => {
    const {stories} = this.props
    const numStories = stories.length
    const center = stories.reduce((latLng, story) => {
      latLng.latitude += story.locationInfo.latitude / numStories
      latLng.longitude += story.locationInfo.longitude / numStories
      return latLng
    }, {latitude: 0, longitude: 0})

    // takig default values from StoryReadingScreens map in case there is only one story.
    let maxLatitudeDelta = 0.0922
    let maxLongitudeDelta = 0.0421
    stories.forEach(story =>{
      maxLatitudeDelta = Math.max(
        maxLatitudeDelta,
        Math.abs(center.latitude - story.locationInfo.latitude)
      )
      maxLongitudeDelta = Math.max(
        maxLongitudeDelta,
        Math.abs(center.longitude - story.locationInfo.longitude)
      )
    })

    const initialRegion = {
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: maxLatitudeDelta,
      longitudeDelta: maxLongitudeDelta,
    }
    this.setState({initialRegion})
    return initialRegion
  }

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
        initialRegion={this.state.initialRegion || this.setInitialRegion()}
        onLayout={this.onLayout}
      >
        {this.renderStoryPins()}
      </MapView>
    )
  }
}

export default GuideMap
