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
import { Metrics, Colors } from '../../Shared/Themes/'
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

  selectLocation = (placeID) => {
    RNGooglePlaces.lookUpPlaceByID(placeID)
    .then((results) => {
      this.props.onSelectLocation(results)
    })
  }

  renderPlaces() {
    return this.state.predictions.map(place => {
      return (
        <View key={place.placeID} style={styles.rowWrapper}>
          <TouchableOpacity onPress={() => this.selectLocation(place.placeID)}>
            <Text style={styles.boldText}>{place.primaryText}</Text>
            <Text style={[styles.boldText, styles.text]}>{place.secondaryText}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  render () {
    const {searching, predictions} = this.state

    return (
      <View style={styles.root}>
        <View style={{marginTop: Metrics.baseMargin, height: 40}}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={this.props.navBack}
          >
            <Text style={styles.doneBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.formWrapper}>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='input'
                style={[styles.textInput, styles.boldText]}
                value={this.state.text}
                placeholder='Location'
                onChangeText={this._onChangeText}
                onSubmitEditing={this._addNewCategory}
                onFocus={this.setInputFocused}
                onBlur={this.setInputBlurred}
              />
            </View>
          </View>
          <ScrollView style={{flexGrow: 3}}>

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
