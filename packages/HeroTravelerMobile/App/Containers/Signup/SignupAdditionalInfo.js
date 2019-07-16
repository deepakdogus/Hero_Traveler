import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text, TextInput, DatePickerIOS } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import moment from 'moment'

import { Images } from '../../Shared/Themes'
import ImageWrapper from '../../Components/ImageWrapper'
import NavButton from '../../Navigation/NavButton'
import RoundedButton from '../../Components/RoundedButton'
import RadioButton from '../../Components/RadioButton'
import { Colors } from '../../Shared/Themes'

import UserActions from '../../Shared/Redux/Entities/Users'

import styles from './SignupAdditionalInfoStyles'

/***
 Helper functions
***/

const dateLikeItemAsDate = dateLikeItem => {
  const timeStamp = Date.parse(dateLikeItem)
  return isNaN(timeStamp) ? new Date() : new Date(timeStamp)
}

class SignupAdditionalInfo extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
    updating: PropTypes.bool,
    error: PropTypes.string,
  }

  state = {
    locationInfo: null,
    birthday: null,
    gender: '',
    showDatePicker: false,
  }

  receiveLocation = locationInfo => {
    this.setState({ locationInfo })
    NavActions.pop()
  }

  navToLocation = () => {
    NavActions.locationSelectorScreen({
      onSelectLocation: this.receiveLocation,
      locationType: 'regions',
    })
  }

  openDatePicker = () => this.setState({ showDatePicker: true })

  getEndRange = () =>
    moment()
      .subtract('year', 13)
      .toDate()

  onDateChange = birthday => this.setState({ birthday })

  confirmDate = () => this.setState({ showDatePicker: false })

  selectGenderOption = gender => this.setState({ gender })

  onGenderTextChange = gender => {
    if (!gender) return this.setState({ gender: 'other' })
    this.setState({ gender })
  }

  onRight = () => {
    const { locationInfo, birthday, gender } = this.state
    const attrs = {}
    if (locationInfo) attrs.locationInfo = locationInfo
    if (birthday) attrs.birthday = birthday
    if (gender) attrs.gender = gender.toLowerCase()

    if (Object.keys(attrs).length > 0) this.props.updateUser(attrs)
    NavActions.signupFlow_topics()
  }

  render = () => {
    const { locationInfo, birthday, gender, showDatePicker } = this.state
    return (
      <ImageWrapper
        background={true}
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={20}
      >
        <View style={styles.navBar}>
          <View style={styles.navButton}>
            <NavButton
              onRight={this.onRight}
              text="Next"
              iconName="arrowRightRed"
            />
          </View>
        </View>
        <View style={[styles.container, styles.root]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Tell us about yourself so we can better customize your experience.
            </Text>
            <Text style={styles.subtitle}>
              (This is optional info that is not visible to other users)
            </Text>
          </View>
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={this.navToLocation}
            >
              <Text style={styles.input}>
                {locationInfo ? locationInfo.name : 'Hometown'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={this.openDatePicker}
            >
              <Text style={styles.input}>
                {birthday ? moment(birthday).format('DD-MM-YYYY') : 'Birthday'}
              </Text>
            </TouchableOpacity>
            <View style={styles.inputContainerNoBorder}>
              <Text style={styles.input}>Gender: </Text>
            </View>
            <View style={styles.radioGroup}>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  style={styles.radioButton}
                  selected={gender === 'male'}
                  value="male"
                  onPress={this.selectGenderOption}
                  text="Male"
                  lightText
                />
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  style={styles.radioButton}
                  selected={gender === 'female'}
                  onPress={this.selectGenderOption}
                  value="female"
                  text="Female"
                  lightText
                />
              </View>
              <View style={styles.radioWithTextInput}>
                <RadioButton
                  selected={!!gender && !['male', 'female'].includes(gender)}
                  onPress={this.selectGenderOption}
                  value="other"
                  text="Other:"
                  lightText
                />
                <View style={styles.radioTextInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Self Describe"
                    value={!['male', 'female', 'other'].includes(gender) ? gender : ''}
                    returnKeyType="done"
                    onChangeText={this.onGenderTextChange}
                    placeholderTextColor={Colors.whiteAlphaPt3}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        {showDatePicker && (
          <View
            style={styles.dateWrapper}
            shadowColor="black"
            shadowOpacity={0.9}
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 0 }}
          >
            <View style={styles.dateView}>
              <DatePickerIOS
                date={dateLikeItemAsDate(this.state.birthday)}
                mode="date"
                maximumDate={this.getEndRange()}
                onDateChange={this.onDateChange}
              />
              <RoundedButton
                text="Confirm"
                onPress={this.confirmDate}
              />
            </View>
          </View>
        )}
      </ImageWrapper>
    )
  }
}

const mapState = state => {
  return {
    error: state.entities.users.error,
    updating: state.entities.users.updating || false,
  }
}

const mapDispatch = dispatch => ({
  updateUser: attrs => dispatch(UserActions.updateUser(attrs)),
})

export default connect(
  mapState,
  mapDispatch,
)(SignupAdditionalInfo)
