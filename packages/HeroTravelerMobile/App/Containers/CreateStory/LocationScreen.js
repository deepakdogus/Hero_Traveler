import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import RNGooglePlaces from 'react-native-google-places'

import Loader from '../../Components/Loader'
import SelectedItem from '../../Components/SelectedItem'

import CategoryActions from '../../Shared/Redux/Entities/Categories'

import styles from './LocationScreenStyles'
import { Colors } from '../../Shared/Themes/'
import formatLocation from '../../Shared/Lib/formatLocation'
import { displayLocationDetails } from '../../Shared/Lib/locationHelpers'
import { getPlaceDetail } from '../../Services/GooglePlaces'

class LocationScreen extends Component {
  static defaultProps = {
    locations: [],
  }

  static propTypes = {
    location: PropTypes.string, // only used for single location selection
    locations: PropTypes.arrayOf(PropTypes.object), // only used for multiple location selection
    locationType: PropTypes.string,
    onSelectLocation: PropTypes.func.isRequired,
    isMultiSelect: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      searching: false,
      predictions: [],
      locations: this.props.locations,
    }
  }

  componentDidMount() {
    const location = this.props.location
    if (location && location.length >= 3) {
      this._onChangeText(location)
    }
  }

  _onChangeText = text => {
    this.setState({ text })
    if (text.length <= 2) return
    this.setState({ searching: true })
    RNGooglePlaces.getAutocompletePredictions(text, {
      type: this.props.locationType || 'geocode',
      locationBias: {
        latitudeSW: -85,
        longitudeSW: 180,
        latitudeNE: 85,
        longitudeNE: -180,
      },
    })
      .then(predictions => this.setState({ searching: false, predictions }))
      .catch(() => this.setState({ searching: false }))
  }

  selectLocation = placeID => async () => {
    const { isMultiSelect, onSelectLocation } = this.props
    this.setState({ searching: true })

    const data = await getPlaceDetail(placeID)
    const newLocation = formatLocation(data)

    // error handle Google returning bad data / format error
    if (!Object.keys(newLocation).length)
      return this.setState({ searching: false })

    if (!isMultiSelect) {
      return this.setState({ searching: false }, () => {
        onSelectLocation(newLocation)
      })
    }

    return this.setState({
      searching: false,
      locations: [...this.state.locations, newLocation],
      text: '',
      predictions: [],
    })
  }

  onSubmit = () => {
    if (this.state.predictions.length || this.props.isMultiSelect) return
    else this.props.onSelectLocation({ name: this.state.text })
  }

  renderPlaces() {
    const { locationType } = this.props
    return this.state.predictions.map(place => {
      if (locationType === 'regions' && place.types.includes('country'))
        return null
      return (
        <View key={place.placeID} style={styles.rowWrapper}>
          <TouchableOpacity onPress={this.selectLocation(place.placeID)}>
            <Text style={styles.boldText}>{place.primaryText}</Text>
            <Text style={[styles.boldText, styles.text]}>
              {place.secondaryText}
            </Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  onRemoveLocation = locationToRemove => {
    const filteredLocations = this.state.locations.filter(location => {
      return (
        location.latitude !== locationToRemove.latitude
        && location.longitude !== locationToRemove.longitude
      )
    })
    this.setState({ locations: filteredLocations })
  }

  renderSelectedLocations = () => {
    return this.state.locations.map((location, index) => {
      return (
        <SelectedItem
          key={`selected${index}`}
          text={displayLocationDetails(location)}
          item={location}
          onPressRemove={this.onRemoveLocation}
        />
      )
    })
  }

  onPressTopRight = () => {
    const { location, onSelectLocation } = this.props
    const { locations, text } = this.state
    if (location) return NavActions.pop() // always Navback is single location
    if (text)
      this.setState({
        text: '',
        predictions: [],
      })
    // clear search
    else onSelectLocation(locations) // submit chosen location
  }

  render() {
    const { searching, predictions, locations, text } = this.state
    const { location } = this.props

    return (
      <View style={styles.root}>
        <View style={styles.topWrapper}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={this.onPressTopRight}
          >
            <Text style={styles.cancelBtnText}>
              {location || text ? 'Cancel' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref="input"
                style={[styles.textInput, styles.boldText]}
                value={this.state.text}
                placeholder="Enter a Location"
                placeholderTextColor={Colors.navBarText}
                onChangeText={this._onChangeText}
                onSubmitEditing={this.onSubmit}
                returnKeyType="done"
                autoFocus={!location}
              />
            </View>
          </View>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
          >
            {!!locations.length && this.renderSelectedLocations()}
            {searching && (
              <Loader
                style={styles.spinner}
                spinnerColor={Colors.blackoutTint}
              />
            )}
            {!searching && !!predictions.length && this.renderPlaces()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default connect(
  state => ({
    defaultCategories: state.entities.categories.entities,
    categoriesFetchStatus: state.entities.categories.fetchStatus,
  }),
  dispatch => ({
    loadDefaultCategories: () =>
      dispatch(CategoryActions.loadCategoriesRequest()),
  }),
)(LocationScreen)
