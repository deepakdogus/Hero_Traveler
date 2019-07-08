import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import R from 'ramda'
import styles from './Styles/ProfileEditScreenStyles'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  DatePickerIOS,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { Colors } from '../Shared/Themes'
import UserActions from '../Shared/Redux/Entities/Users'
import NavBar from '../Containers/CreateStory/NavBar'
import pathAsFileObject from '../Shared/Lib/pathAsFileObject'
import ShadowButton from '../Components/ShadowButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { FormTextInput } from '../Components/FormTextInput'
import RadioButton from '../Components/RadioButton'
import {
  validate,
  asyncValidate as asyncValidateOriginal,
  setOriginalUsername,
} from '../Shared/Lib/userFormValidation'
import HeroAPI from '../Shared/Services/HeroAPI'

const api = HeroAPI.create()

const asyncValidate = values => {
  // Make the validation ignore our own username
  return asyncValidateOriginal(values, null, true)
}

class ProfileEditScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    accessToken: PropTypes.string,
    newValues: PropTypes.object,
    updateUser: PropTypes.func,
    updateUserSuccess: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      locationInfo: null,
      birthday: null,
      gender: '',
      showDatePicker: false,
    }
  }

  componentDidMount() {
    const { accessToken, user } = this.props
    const userLocationInfo = _.get(user, 'locationInfo[0].name')
    this.setState({ locationInfo: userLocationInfo })
    api.setAuth(accessToken)
    if (user) setOriginalUsername(user.username)
  }

  _handleUpdateAvatarPhoto = data => {
    api
      .uploadAvatarImage(this.props.user.id, pathAsFileObject(data))
      .then(({ data }) => {
        // if there is a message it means there was an error
        if (data.message) {
          return Promise.reject(new Error(data.message))
        }
        else {
          this.props.updateUserSuccess({
            id: data.id,
            profile: {
              tempAvatar: _.get(data, 'profile.avatar'),
            },
          })
        }
      })
      .then(() => {
        NavActions.pop()
      })
      .catch(() => {
        NavActions.pop()
        this.setState({
          error: 'There was an error updating your profile photo. Please try again',
        })
      })
  }

  _onRight = () => {
    this._updateUser()
  }

  _updateUser = () => {
    this.props.updateUser({
      username: this.props.newValues.username,
      'profile.fullName': this.props.newValues.fullName,
      about: this.props.newValues.about,
      bio: this.props.newValues.bio,
      locationInfo: this.state.locationInfo,
    })
    NavActions.pop()
  }

  selectGenderOption = gender => {
    this.setState({ gender: gender.toString() })
  }

  onGenderTextChange = gender => {
    if (!gender) return this.setState({ gender: 'other' })
    this.setState({ gender })
  }

  navToLocation = () => {
    NavActions.locationSelectorScreen({
      onSelectLocation: this.receiveLocation,
      locationType: 'regions',
    })
  }

  receiveLocation = locationInfo => {
    this.setState({ locationInfo })
    NavActions.pop()
  }

  _onLeft = () => {
    const { id, profile } = this.props.user

    // currently tempCover and tempAvatar are actually directly saved to DB - so we need to revert
    // need to add fullName so that we dont accidentally set it to undefined
    if (profile) {
      const profileReverts = {
        fullName: profile.fullName,
        cover: profile.cover,
        avatar: profile.avatar,
      }
      this.props.updateUser({
        profile: profileReverts,
      })
    }

    this.props.updateUserSuccess({
      id,
      profile: {
        tempCover: undefined,
        tempAvatar: undefined,
      },
    })
    NavActions.pop()
  }

  _selectAvatar = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'EDIT AVATAR',
      titleStyle: { color: Colors.background },
      leftTitle: 'Cancel',
      leftTextStyle: { color: Colors.background },
      onLeft: () => NavActions.pop(),
      rightTitle: 'Done',
      rightIcon: 'none',
      onSelectMedia: this._handleUpdateAvatarPhoto,
    })
  }

  renderAvatar() {
    const user = this.props.user
    const [userAvatar, tempAvatar]
      = user && user.profile
        ? [user.profile.avatar, user.profile.tempAvatar]
        : [undefined, undefined]
    const avatarUrl = getImageUrl(tempAvatar ? tempAvatar : userAvatar, 'avatarLarge')

    return (
      <View style={styles.profileWrapper}>
        <View style={styles.avatarWrapper}>
          <Avatar size="extraLarge" avatarUrl={avatarUrl} style={styles.avatar} />
          <TouchableOpacity
            style={styles.addAvatarPhotoButton}
            onPress={this._selectAvatar}
          >
            <Icon
              name="camera"
              size={32.5}
              color={Colors.whiteAlphaPt80}
              style={styles.updateAvatorIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.avatarEditTextWrapper}
          onPress={this._selectAvatar}
        >
          <Text style={styles.avatarEditText}>Edit profile picture</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { user, handleSubmit } = this.props
    const { locationInfo, gender } = this.state
    const locationInfoName = _.get(locationInfo, 'name')
    const userLocationInfo = _.get(user, 'locationInfo[0].name')

    return (
      <View style={styles.flexOne}>
        <NavBar
          title="EDIT PROFILE"
          leftTitle="Cancel"
          onLeft={this._onLeft}
          rightTitle="Save"
          onRight={handleSubmit(this._onRight)}
          style={styles.navbarStyle}
        />
        <View style={styles.gradientWrapper}>
          <ScrollView style={[styles.flexOne, styles.topBorder]}>
            <View style={styles.flexOne}>
              {this.renderAvatar()}

              <View style={styles.form}>
                <Field
                  name="username"
                  autoCapitalize="none"
                  component={FormTextInput}
                  styles={styles}
                  label="User Name"
                  placeholder=""
                  initialValue={user.username}
                />
                <Field
                  name="fullName"
                  component={FormTextInput}
                  styles={styles}
                  label="Full Name"
                  placeholder="Your Name"
                  initialValue={user.fullName}
                />
                <Field
                  name="about"
                  component={FormTextInput}
                  styles={styles}
                  label="About"
                  placeholder="What do you do? What do you like? Etc."
                  multiline={true}
                  maxLength={63}
                />
                <Field
                  name="bio"
                  component={FormTextInput}
                  styles={styles}
                  label="Bio"
                  placeholder="Tell us about yourself in detail"
                  multiline={true}
                  maxLength={500}
                />
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={this.navToLocation}
                >
                  <Text style={styles.inputLabel}>Location</Text>
                  <Text style={styles.input}>
                    {locationInfoName
                      || userLocationInfo
                      || 'Location is optional and not visible to other users'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.inputWrapper}>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      style={styles.radioButton}
                      selected={gender === 'male'}
                      value="male"
                      onPress={this.selectGenderOption}
                      text="Male"
                    />
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      style={styles.radioButton}
                      selected={gender === 'female'}
                      onPress={this.selectGenderOption}
                      value="female"
                      text="Female"
                    />
                  </View>
                  <View style={styles.radioWithTextInput}>
                    <RadioButton
                      selected={!!gender && !['male', 'female'].includes(gender)}
                      onPress={this.selectGenderOption}
                      value="other"
                      text="Other:"
                    />
                    <View style={styles.radioTextInputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Self Describe"
                        value={
                          !['male', 'female', 'other'].includes(gender) ? gender : ''
                        }
                        returnKeyType="done"
                        onChangeText={this.onGenderTextChange}
                        placeholderTextColor={Colors.whiteAlphaPt3}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {this.state.error && (
          <ShadowButton
            style={styles.errorButton}
            onPress={this._clearError}
            text={this.state.error}
          />
        )}
      </View>
    )
  }
}

const selector = formValueSelector('editProfileForm')

const mapStateToProps = state => {
  const { userId } = state.session
  const user = state.entities.users.entities[userId]
  return {
    accessToken: _.find(state.session.tokens, { type: 'access' }).value,
    user,
    initialValues: {
      username: user.username,
      fullName: _.get(user, 'profile.fullName'),
      about: user.about,
      bio: user.bio,
    },
    newValues: {
      username: _.trim(selector(state, 'username')),
      fullName: _.trim(selector(state, 'fullName')),
      about: _.trim(selector(state, 'about')),
      bio: _.trim(selector(state, 'bio')),
    },
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: attrs => dispatch(UserActions.updateUser(attrs)),
    updateUserSuccess: user => dispatch(UserActions.updateUserSuccess(user)),
  }
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form: 'editProfileForm',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate,
    asyncValidate: asyncValidate,
    asyncBlurFields: ['username', 'email'],
  }),
)(ProfileEditScreen)
