import React from 'react'
import styled from 'styled-components'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import PropTypes from 'prop-types'
import _ from 'lodash'
import onClickOutside from 'react-onclickoutside'
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
  constructor() {
    super()
    this.state = {
      items: [],
      address: '',
    }
  }
  componentDidMount = () => {
    if (this.props.address) {
      this.setState({
        address: this.props.address,
      })
    }
  }

  handleClickOutside = () => {
    console.log('Does it match', this.state.address, this.props.address)
    if (!this.props.address && this.state.items[0] || (this.state.address !== this.props.address)) {
      console.log('Going oto autifill', this.state.items)
      this.handleSelect(undefined, true)
    }
  }


  handleInputChange = (text) => {
    this.setState({
      address: text,
    })
    console.log(this.refs.places.state)
    const { autocompleteItems } = this.refs.places.state
    if (!_.isEqual(autocompleteItems, this.state.items)) {
      this.setState({
        items: autocompleteItems,
      })
    }
  }

  handleSelect = (event, autofill = false) => {
    let locationUpdate

    if (autofill && this.state.items[0]) {

      locationUpdate = {
        location: this.state.items[0].suggestion.split(',')[0]
      } 
      console.log('LCOATION UD', locationUpdate)
    }
    else {
      locationUpdate = {
        location: event.split(',')[0]
      }
    }
    console.log('LOCATION UODA', locationUpdate)
    geocodeByAddress(event)
    .then(results => {
      console.log("results are", results)
      return getLatLng(results[0])
    })
    .then(latLng => {
      locationUpdate.latitude = latLng.lat
      locationUpdate.longitude = latLng.lng
      this.props.onChange(locationUpdate)
      this.setState({
        address: locationUpdate.location,
      })
    })
    .catch(error => console.error('Error', error))
  }

  onChange = (address) => this.props.onChange({ location: address })

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.handleInputChange,
      placeholder: 'Add location',
    }

    const AutocompleteItem = ({ formattedSuggestion, ...rest }) => {
      return (
      <div>
        <StyledLocation>{ formattedSuggestion.mainText }</StyledLocation>
        <StyledAddress>{ formattedSuggestion.secondaryText }</StyledAddress>
        <StyledHorizontalDivider color='lighter-grey' opaque/>
      </div>
      )
    }
    console.log('STATE', this.state)
    return (
      <Container>
        <PlacesAutocomplete
          ref='places'
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

export default onClickOutside(GoogleLocator)
