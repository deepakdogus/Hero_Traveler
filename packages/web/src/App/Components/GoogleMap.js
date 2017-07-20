import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from 'lodash'

const GettingStartedGoogleMap = withGoogleMap(props => {
  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={11}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      onClick={props.onMapClick}
    >
      {props.markers && props.markers.map((marker, index) => (
        <Marker
          {...marker}
          onRightClick={() => props.onMarkerRightClick(index)}
        />
      ))}
    </GoogleMap>
  )}
);

export default class GMap extends React.Component {

  render () {
    const {lat, lng, location} = this.props
    const markers = [{
      position: {
        lat: lat,
        lng: lng,
      },
      key: `${location}`,
      defaultAnimation: 2,
    }]
    return (
      <GettingStartedGoogleMap
        lat={lat}
        lng={lng}
        containerElement={
          <div style={{ height: `500px` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        onMapLoad={_.noop}
        onMapClick={_.noop}
        markers={markers}
        onMarkerRightClick={_.noop}
      />
    )
  }
}
