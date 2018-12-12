import React from 'react'
import styled from 'styled-components'
import PlacesAutocomplete, {getLatLng, geocodeByAddress} from 'react-places-autocomplete'
import PropTypes from 'prop-types'
import { formatLocationWeb } from '../../Shared/Lib/formatLocation'

import HorizontalDivider from '../HorizontalDivider'
import './Styles/GoogleLocatorStyles.css'

const Container = styled.div`
  display: inline-block;
  margin-left: 25px;
  width: ${props => props.isGuide ? '' : '80%' };
`

const InputContainer = styled.div`
  position: relative;
  padding-bottom: 0px;
  width: 100%;
`

const DropdownContainer = styled.div`
  position: absolute;
  top: 35px;
  left: 0px;
  background-color: white;
  border: none;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  width: 320px;
  z-index: 100;
  margin: 10px 0px;
`

const StyledInput = styled.input`
  display: inline-block;
  width: 100%;
  padding: 1px;
  outline: none;
  border: none;
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .2px;
  color: #1a1c21;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  margin: 10px 0px;
`

const InactiveAutocompleteItemContainer = styled.div`
  background-color: #ffffff;
  color: #555555;
  cursor: pointer;
`

const ActiveAutocompleteItemContainer = styled(InactiveAutocompleteItemContainer)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
`

const AutocompleteItem = styled.div`
  padding: 10px;
`

const StyledLocation = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.background};
  margin: 0px;
`

const StyledAddress = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.grey};
  margin: 0px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  padding: 0;
  border-width: 1px;
  margin: 0 10px;
`

class GoogleLocator extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    onChange: PropTypes.func,
    isGuide: PropTypes.bool,
  }

  handleSelect = async address => {
    let locationInfo = await formatLocationWeb(address, geocodeByAddress, getLatLng)
    this.props.onChange({locationInfo: locationInfo})
  }

  onChange = (address) => this.props.onChange({ location: address })

  render() {
    return (
      <Container isGuide={this.props.isGuide}>
        <PlacesAutocomplete
          value={this.props.address}
          onChange={this.onChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <InputContainer>
              <StyledInput
                {...getInputProps({
                  placeholder: 'Add location',
                })}
              />
              <DropdownContainer>
                {suggestions.map((suggestion, idx) => {
                  // const { formattedSuggestion } = suggestion
                  const AutocompleteContainer = suggestion.active
                    ? ActiveAutocompleteItemContainer
                    : InactiveAutocompleteItemContainer
                  return (
                    <AutocompleteContainer
                      key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion)}
                    >
                      <AutocompleteItem>
                        <StyledLocation>
                          { suggestion.formattedSuggestion.mainText }
                        </StyledLocation>
                        <StyledAddress>
                          { suggestion.formattedSuggestion.secondaryText }
                        </StyledAddress>
                      </AutocompleteItem>
                      {idx !== suggestions.length - 1 &&
                        <StyledHorizontalDivider color='lighter-grey' opaque/>
                      }
                    </AutocompleteContainer>
                  )
                })}
              </DropdownContainer>
          </InputContainer>
        )}
        </PlacesAutocomplete>
      </Container>
    )
  }
}

export default GoogleLocator
