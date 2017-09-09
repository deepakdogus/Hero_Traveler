import React from 'react'
import styled from 'styled-components'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const StyledForm = styled.form`
  display: inline-block;
  margin-left: 14px;
  width: 80%;
`

const StyledLocation = styled.p`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.background};
  margin: 0px;
`

const StyledAddress = styled.p`
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.grey};
  margin: 0px;
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
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
    borderBottom: '1px solid #eeeeee',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
  },
}


class GoogleLocator extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
  }
 
  handleFormSubmit = (event) => {
    event.preventDefault()
 
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }
  
  onChange = (address) => this.setState({ address })

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'Add location',
    }
  
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div>
        <StyledLocation>{ formattedSuggestion.mainText }</StyledLocation>
        <StyledAddress>{ formattedSuggestion.secondaryText }</StyledAddress>
      </div>
      )

    return (
      <StyledForm onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete 
          inputProps={inputProps}
          autocompleteItem={AutocompleteItem}
          styles={styles}
          googleLogo={false}
        />
      </StyledForm>
    )
  }
}
 
export default GoogleLocator