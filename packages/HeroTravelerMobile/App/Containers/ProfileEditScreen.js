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
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector, actions as FormActions } from 'redux-form'

import { Colors } from '../Shared/Themes'
import UserActions from '../Shared/Redux/Entities/Users'
import NavBar from '../Containers/CreateStory/NavBar'
import HeroAPI from '../Shared/Services/HeroAPI'
import pathAsFileObject from '../Shared/Lib/pathAsFileObject'
import ShadowButton from '../Components/ShadowButton'
import Icon from 'react-native-vector-icons/FontAwesome'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { FormTextInput } from '../Components/FormTextInput';

const api = HeroAPI.create()

const Constants = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  USERNAME_MIN_LENGTH: 5,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{5,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const validate = (values) => {
  const errors = {}

  if (!values.fullName) {
    errors.fullName = 'Required'
  } else if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length < Constants.USERNAME_MIN_LENGTH || values.username.length > Constants.USERNAME_MAX_LENGTH) {
    errors.username = `Must be between ${Constants.USERNAME_MIN_LENGTH} and ${Constants.USERNAME_MAX_LENGTH} characters`
  } else if (!Constants.USERNAME_REGEX.test(values.username)) {
    errors.username = 'Usernames may contain letters, numbers, _ and -'
  } else if (!values.email) {
    errors.email = 'Required'
  } else if (!Constants.EMAIL_REGEX.test(values.email)) {
    errors.email = 'Invalid email address'
  } else if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < Constants.PASSWORD_MIN_LENGTH || values.password.length > Constants.PASSWORD_MAX_LENGTH) {
    errors.password = `Passwords must be ${Constants.PASSWORD_MIN_LENGTH} to ${Constants.PASSWORD_MAX_LENGTH} characters long`
  } else if (!values.confirmPassword || values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}

const asyncValidate = (values) => {
  return api.signupCheck(values)
  .then(response => {
    const {data} = response
    const errors = {}
    for (let key in data) {
      if (key !== 'username' && data[key]) errors[key] = `That ${key} is already taken`
    }
    if (Object.keys(errors).length) throw errors
    return {}
  })
}

class ProfileEditScreen extends React.Component {

  static defaultProps = {
  }

  constructor(props) {
    super(props)
    this.state = {
      imageMenuOpen: false,
      file: null,
      bioText: props.user.bio || '',
      usernameText: props.user.username || 'Enter a username',
      aboutText: props.user.about || '',
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken)
  }

  _handleUpdateAvatarPhoto = (data) => {
    api.uploadAvatarImage(this.props.user.id, pathAsFileObject(data))
    .then(({ data }) => {
      // if there is a message it means there was an error
      if (data.message) {
        return Promise.reject(new Error(data.message))
      }
      else {
        this.props.updateUserSuccess({
          id: data.id,
          profile: {
            tempAvatar: data.profile.avatar,
          }
        })
      }
    })
    .then(() => {
      NavActions.pop()
    })
    .catch(() => {
      NavActions.pop()
      this.setState({error: 'There was an error updating your profile photo. Please try again'})
    })
  }

  _onRight = () => {
    this._updateUser();
  }

  _updateUser = () => {
    this.props.updateUser({
      username: this.props.newValues.username,
      'profile.fullName': this.props.newValues.fullName,
      about: this.props.newValues.about,
      bio: this.props.newValues.bio,
    })
    NavActions.pop()
  }

  _onLeft = () => {
    const {id, profile} = this.props.user

    // currently tempCover and tempAvatar are actually directly saved to DB - so we need to revert
    // need to add fullName so that we dont accidentally set it to undefined
    const profileReverts = { fullName: profile.fullName }
    if (profile.tempCover) profileReverts.cover = profile.cover
    if (profile.tempAvatar) profileReverts.avatar = profile.avatar
    if (Object.keys(profileReverts).length) {
      this.props.updateUser({
        profile: profileReverts,
      })
    }

    this.props.updateUserSuccess({
      id,
      profile: {
        tempCover: undefined,
        tempAvatar: undefined,
      }
    })
    NavActions.pop()
  }

  _selectAvatar = () => {
    NavActions.mediaSelectorScreen({
      mediaType: 'photo',
      title: 'Edit Avatar',
      titleStyle: {color: Colors.white},
      leftTitle: 'Cancel',
      leftTextStyle: {color: Colors.white},
      onLeft: () => NavActions.pop(),
      rightTitle: 'Done',
      rightIcon: 'none',
      onSelectMedia: this._handleUpdateAvatarPhoto
    })
  }

  _handleUpdateAvatarPhoto = (data) => {
    api.uploadAvatarImage(this.props.user.id, pathAsFileObject(data))
    .then(({ data }) => {
      // if there is a message it means there was an error
      if (data.message) {
        return Promise.reject(new Error(data.message))
      }
      else {
        this.props.updateUserSuccess({
          id: data.id,
          profile: {
            tempAvatar: data.profile.avatar,
          }
        })
      }
    })
    .then(() => {
      NavActions.pop()
    })
    .catch(() => {
      NavActions.pop()
      this.setState({error: 'There was an error updating your profile photo. Please try again'})
    })
  }

  renderAvatar() {
    const user = this.props.user;

    const avatarUrl = (user.profile.tempAvatar) ?
      getImageUrl(user.profile.tempAvatar, 'avatar') :
      getImageUrl(user.profile.avatar, 'avatar')

    return (
      <View style={styles.profileWrapper}>
        <View style={styles.avatarWrapper}>
          <Avatar
            size='extraLarge'
            avatarUrl={avatarUrl}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.addAvatarPhotoButton}
            onPress={this._selectAvatar}
          >
            <Icon
              name='camera'
              size={32.5}
              color={Colors.whiteAlphaPt80}
              style={styles.updateAvatorIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.avatarEditTextWrapper}
          onPress={this._selectAvatar}
        >
          <Text style={styles.avatarEditText}>
            Edit profile picture
          </Text>
        </TouchableOpacity>
      </View>
    )
  }


  render() {
    const {user, handleSubmit} = this.props;

    return (
      <View style={styles.flexOne}>
        <NavBar
          title='Edit Profile'
          leftTitle='Cancel'
          onLeft={this._onLeft}
          rightTitle='Save'
          onRight={handleSubmit(this._onRight)}
          style={styles.navbarStyle}
        />

        <View style={styles.gradientWrapper}>
          <ScrollView style={styles.flexOne}>
            <View style={styles.flexOne}>

              {this.renderAvatar()}

              <View
                style={styles.form}
              >
                <Field
                  name='username'
                  autoCapitalize='none'
                  component={FormTextInput}
                  styles={styles}
                  label='User Name'
                  placeholder=''
                  initialValue={user.username}
                />
                <Field
                  name='fullName'
                  component={FormTextInput}
                  styles={styles}
                  label='Full Name'
                  placeholder='Your Name'
                  initialValue={user.fullName}
                />
                <Field
                  name='about'
                  component={FormTextInput}
                  styles={styles}
                  label='About'
                  placeholder='What do you do? What do you like? Etc.'
                  multiline={true}
                />
                <Field
                  name='bio'
                  component={FormTextInput}
                  styles={styles}
                  label='Bio'
                  placeholder='Tell us about yourself in detail'
                  multiline={true}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        {this.state.error &&
          <ShadowButton
            style={styles.errorButton}
            onPress={this._clearError}
            text={this.state.error}
          />
        }
      </View>
    )
  }
}

const selector = formValueSelector('editProfileForm')

const mapStateToProps = (state) => {
  const {userId} = state.session;
  const user = state.entities.users.entities[userId];
  return {
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
    user,
    initialValues: {
      username: user.username,
      fullName: user.profile.fullName,
      about: user.about,
      bio: user.bio,
    },
    newValues: {
      username: _.trim(selector(state, 'username')),
      fullName: _.trim(selector(state, 'fullName')),
      about: _.trim(selector(state, 'about')),
      bio: _.trim(selector(state, 'bio')),
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
    updateUserSuccess: (user) => dispatch(UserActions.updateUserSuccess(user)),
  }
}

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editProfileForm',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate,
    asyncValidate: asyncValidate,
    asyncBlurFields: ['username', 'email'],
  })
)(ProfileEditScreen)


// export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)
