import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {connect} from 'react-redux'

import RNGooglePlaces from 'react-native-google-places'
import CategoryActions from '../../Shared/Redux/Entities/Categories'
import { Colors } from '../../Shared/Themes/'
import formatLocation from '../../Shared/Lib/formatLocation'
import Loader from '../../Components/Loader'
import styles from './LocationScreenStyles'

class LocationScreen extends Component {

  static propTypes = {
    location: PropTypes.string,
    navBack: PropTypes.func.isRequired,
    onSelectLocation: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      searching: false,
      predictions: [],
    }
  }

  componentDidMount(){
    const location = this.props.location
    if (location && location.length >= 3) {
      this._onChangeText(location)
    }
  }

  _onChangeText = (text) => {
    this.setState({text})
    if (text.length <= 2) return
    this.setState({searching: true})
    RNGooglePlaces.getAutocompletePredictions(text)
    .then((predictions) => this.setState({searching: false, predictions}))
    .catch(() => this.setState({searching: false}))
  }

  selectLocation = (placeID) => () => {
    this.setState({searching: true})
    RNGooglePlaces.lookUpPlaceByID(placeID)
    .then((result) => {
      this.setState({searching: false}, () => {
        this.props.onSelectLocation(formatLocation(result))
      })
    })
  }

  onSubmit = () => {
    if (this.state.predictions.length) return
    else this.props.onSelectLocation({"name": this.state.text})
  }

  renderPlaces() {
    return this.state.predictions.map(place => {
      return (
        <View key={place.placeID} style={styles.rowWrapper}>
          <TouchableOpacity onPress={this.selectLocation(place.placeID)}>
            <Text style={styles.boldText}>{place.primaryText}</Text>
            <Text style={[styles.boldText, styles.text]}>{place.secondaryText}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  render () {
    const {searching, predictions} = this.state
    const { location } = this.props
    return (
      <View style={styles.root}>
        <View style={styles.topWrapper}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={this.props.navBack}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='input'
                style={[styles.textInput, styles.boldText]}
                value={this.state.text}
                placeholder='Enter a Location'
                placeholderTextColor={Colors.navBarText}
                onChangeText={this._onChangeText}
                onSubmitEditing={this.onSubmit}
                returnKeyType='done'
                autoFocus={!location}
              />
            </View>
          </View>
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='always'>
            {searching  &&
              <Loader style={styles.spinner} spinnerColor={Colors.blackoutTint} />
            }
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
    categoriesFetchStatus: state.entities.categories.fetchStatus
  }),
  dispatch => ({
    loadDefaultCategories: () => dispatch(CategoryActions.loadCategoriesRequest())
  })
)(LocationScreen)
