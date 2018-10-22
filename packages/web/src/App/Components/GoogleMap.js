import React from 'react'
import PropTypes from 'prop-types'
import {
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer"
import _ from 'lodash'

import getImageUrl from '../Shared/Lib/getImageUrl'
import MapMarker from './MapMarker'

const windowMaps = window.google.maps

const videoThumbnailOptions = {
  video: true,
  width: 140,
}

const HOCMap = withGoogleMap(props => {
  const {
    selectedMarkerId,
    setSelectedMarkerId,
  } = props
  const center = new windowMaps.LatLng(
    props.lat,
    props.lng,
  )

  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={11}
      defaultCenter={center}
      onClick={props.onMapClick}
    >
      <MarkerClusterer averageCenter>
        {props.markers && props.markers.map((marker, index) => (
          <MapMarker
            {...marker}
            setSelectedMarkerId={setSelectedMarkerId}
            isSelected={marker.id === selectedMarkerId}
            key={marker.id}
          />
        ))}
      </MarkerClusterer>
    </GoogleMap>
  )}
);

export default class GMap extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
    reroute: PropTypes.func,
  }

  defaultProps = {
    stories: [],
  }

  state = {
    selectedMarkerId: undefined
  }

  componentDidUpdate(prevProps) {
    if (this.getAreStoriesDifferent(prevProps.stories, this.props.stories)) {
      this.recenterMap()
    }
  }

  getAreStoriesDifferent(oldStories, newStories) {
    if (oldStories.length !== newStories.length) return true
    return oldStories.some((story, index) => {
      return story.id !== newStories[index].id
    })
  }

  getMarkers() {
    const {reroute, stories} = this.props
    return stories.map((story, index) => {
      let imageUrl
      if (story.coverImage) {
        imageUrl = getImageUrl(story.coverImage)
      }
      else if (story.coverVideo) {
        imageUrl = getImageUrl(story.coverVideo, 'optimized', videoThumbnailOptions)
      }
      return {
        position: {
          lat: story.locationInfo.latitude,
          lng: story.locationInfo.longitude,
        },
        title: story.title,
        id: story.id,
        defaultAnimation: 2,
        imageUrl,
        reroute,
      }
    })
  }

  getBounds() {
    const bounds = new windowMaps.LatLngBounds()
    this.props.stories.forEach(story => {
      const {latitude, longitude} = story.locationInfo
      bounds.extend(
        new windowMaps.LatLng(
          latitude,
          longitude,
        )
      )
    })

    // edge case for single story so we are not overly zoomed in
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      var extendPointNE = new windowMaps.LatLng(
        bounds.getNorthEast().lat() + 0.01,
        bounds.getNorthEast().lng() + 0.01
      )
      var extendPointSW =  new windowMaps.LatLng(
        bounds.getNorthEast().lat() - 0.01,
        bounds.getNorthEast().lng() - 0.01
      )
      bounds.extend(extendPointNE)
      bounds.extend(extendPointSW)
    }

    return bounds
  }

  recenterMap = () => {
    if (this.gMapRef) {
      this.gMapRef.fitBounds(this.getBounds())
    }
  }

  onMapLoad = (ref) => {
    this.gMapRef = ref
    this.recenterMap()
  }

  setSelectedMarkerId = (selectedMarkerId) => {
    this.setState({ selectedMarkerId })
  }

  render () {
    return (
      <HOCMap
        containerElement={
          <div style={{ height: `500px`, margin: `60px 0` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        onMapLoad={this.onMapLoad}
        onMapClick={_.noop}
        selectedMarkerId={this.state.selectedMarkerId}
        setSelectedMarkerId={this.setSelectedMarkerId}
        markers={this.getMarkers()}
        onMarkerRightClick={_.noop}
        bounds={this.getBounds()}
      />
    )
  }
}
