import React from 'react'
import PropTypes from 'prop-types'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer"
import _ from 'lodash'
const windowMaps = window.google.maps

const HOCMap = withGoogleMap(props => {
  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={11}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      onClick={props.onMapClick}
    >
      <MarkerClusterer averageCenter>
        {props.markers && props.markers.map((marker, index) => (
          <Marker
            {...marker}
            onRightClick={() => props.onMarkerRightClick(index)}
          />
        ))}
      </MarkerClusterer>
    </GoogleMap>
  )}
);

export default class GMap extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
  }

  getMarkers() {
    return this.props.stories.map((story, index) => {
      return {
        position: {
          lat: story.locationInfo.latitude,
          lng: story.locationInfo.longitude,
        },
        key: `${story.locationInfo.name}-${index}`,
        defaultAnimation: 2,
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

  onMapLoad = (ref) => {
    this.gMapRef = ref
    if (this) {
      ref.fitBounds(this.getBounds())
    }
  }

  render () {
    return (
      <HOCMap
        lat={this.props.stories[0].locationInfo.latitude}
        lng={this.props.stories[0].locationInfo.longitude}
        containerElement={
          <div style={{ height: `500px` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        onMapLoad={this.onMapLoad}
        onMapClick={_.noop}
        markers={this.getMarkers()}
        onMarkerRightClick={_.noop}
        bounds={this.getBounds()}
      />
    )
  }
}
