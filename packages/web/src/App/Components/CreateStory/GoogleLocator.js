import React from 'react'
import styled from 'styled-components'
import PlacesAutocomplete, {getLatLng, geocodeByAddress} from 'react-places-autocomplete'
import PropTypes from 'prop-types'
import { formatLocationWeb } from '../../Shared/Lib/formatLocation'

import HorizontalDivider from '../HorizontalDivider'
import './Styles/GoogleLocatorStyles.css';

const Container = styled.div`
  display: inline-block;
  margin-left: 25px;
  width: ${props => props.isGuide ? '' : '80%' }
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
    width: '100%',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '1px',
    outline: 'none',
    border: 'none',
    fontWeight: '400',
    fontSize: '18px',
    letterSpacing: '.7px',
    color: '#1a1c21',
    fontFamily: 'source sans pro',
    margin: '10px 0px',
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
    overflowY: 'auto',
    zIndex: '100',
    margin: '10px 0px',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#ffffff',
  },
}

class GoogleLocator extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    onChange: PropTypes.func,
    isGuide: PropTypes.bool,
  }

  handleSelect = async (event) => {
    let locationInfo = await formatLocationWeb(event, geocodeByAddress, getLatLng)
    this.props.onChange({locationInfo: locationInfo})
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
      <Container isGuide={this.props.isGuide}>
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
