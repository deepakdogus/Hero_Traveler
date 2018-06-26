import React from 'react'
import styled from 'styled-components'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import PropTypes from 'prop-types'

import HorizontalDivider from '../HorizontalDivider'
import './Styles/GoogleLocatorStyles.css';

const Container = styled.div`
  display: inline-block;
  margin-left: 20px;
  width: 80%;
`

const StyledLocation = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.background};
  margin: 0px;
`

const StyledAddress = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.grey};
  margin: 0px;
  padding-bottom: 10px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
  border-width: 1px;
`

const styles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
    outline: 'none',
    border: 'none',
    fontWeight: '400',
    fontSize: '18px',
    letterSpacing: '.7px',
    color: '#1a1c21',
    fontFamily: 'source sans pro',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '124%',
    left: '10px',
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    width: '320px',
    height: '400px',
    padding: '5px',
    overflowY: 'auto',
    zIndex: '100',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px 10px 0px 10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#ffffff'
  },
}


class GoogleLocator extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    onChange: PropTypes.func,
  }

  _formatLocationUpdate = (locationUpdate, result) => {
    result.address_components.forEach( component => {
      if(component.types.includes('locality') || component.types.includes('sublocality_level_1 ')){
        locationUpdate.locality = component.long_name
      }
      if(component.types.includes('administrative_area_level_1')){
        locationUpdate.state = component.long_name
      }
      if(component.types.includes('country')){
        locationUpdate.country = component.long_name
      }
    })
    return locationUpdate
  }

  handleSelect = (event) => {
    let locationUpdate = {
      name: event.split(',')[0]
    }
    geocodeByAddress(event)
    .then(results => {
      locationUpdate = (this._formatLocationUpdate(locationUpdate, results[0]))
      return getLatLng(results[0])
    })
    .then(latLng => {
      locationUpdate.latitude = latLng.lat
      locationUpdate.longitude = latLng.lng
      this.props.onChange({
        locationInfo: locationUpdate,
        location: event
      })
    })
    .catch(error => console.error('Error', error))
  }

  onChange = (address) => this.props.onChange({ location: address })

  render() {
    const inputProps = {
      value: this.props.address,
      onChange: this.onChange,
      placeholder: 'Add location',
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div>
        <StyledLocation>{ formattedSuggestion.mainText }</StyledLocation>
        <StyledAddress>{ formattedSuggestion.secondaryText }</StyledAddress>
        <StyledHorizontalDivider color='lighter-grey' opaque/>
      </div>
      )

    return (
      <Container>
        <PlacesAutocomplete
          inputProps={inputProps}
          autocompleteItem={AutocompleteItem}
          styles={styles}
          onSelect={this.handleSelect}
          googleLogo={false}
        />
      </Container>
    )
  }
}

export default GoogleLocator
