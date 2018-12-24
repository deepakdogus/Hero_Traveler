import PlacesAutocomplete from 'react-places-autocomplete'

export default class ExtendedPlacesAutocomplete extends PlacesAutocomplete {
  handleSelect = () => {}

  handleInputKeyDown = () => {}

  handleInputOnBlur = () => {}

  init = () => {
    const { value } = this.props

    if (!window.google) {
      throw new Error(
        '[react-places-autocomplete]: Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library',
      )
    }

    if (!window.google.maps.places) {
      throw new Error(
        '[react-places-autocomplete]: Google Maps Places library must be loaded. Please add `libraries=places` to the src URL. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library',
      )
    }

    this.autocompleteService = new window.google.maps.places.AutocompleteService()
    this.autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK
    this.setState(state => {
      if (state.ready) {
        return null
      }
      else {
        return { ready: true }
      }
    })

    if (value) this.fetchPredictions()
  }
}
