import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  ScrollView,
  Text,
  View,
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import R from 'ramda'

import SignupActions, {hasSignedUp} from '../../Shared/Redux/SignupRedux'
import { Images, Colors } from '../../Shared/Themes'
import Loader from '../../Components/Loader'
import RoundedButton from '../../Components/RoundedButton'
import ImageWrapper from '../../Components/ImageWrapper'
import TOS from '../../Components/TosFooter'
import styles from '../Styles/SignupScreenStyles'
import {validate, asyncValidate} from '../../Shared/Lib/userFormValidation'
import { FormTextInput } from '../../Components/FormTextInput'

class SignupScreen extends React.Component {
  static propTypes = {
    fetching: PropTypes.bool,
    attemptSignup: PropTypes.func,
    handleSubmit: PropTypes.func,
    hasSignedUp: PropTypes.bool,
    signupFacebook: PropTypes.func,
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    signupError: PropTypes.string,
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && newProps.hasSignedUp) {
      NavigationActions.signupFlow()
    }
  }

  _signup = () => {
    if (!this.props.fetching) {
      this.props.attemptSignup(
        _.trim(this.props.fullName),
        _.trim(this.props.username),
        _.trim(this.props.email),
        this.props.password,
      )
    }
  }

  // this.props.fetching
  render () {
    const {handleSubmit} = this.props
    return (
      <ImageWrapper
        background={true}
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={20}
      >
        <ScrollView style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.title}>SIGN UP</Text>
              <Text style={styles.instructions}>
                {`Let's start by setting up your account`}
              </Text>
              {this.props.signupError && <Text style={[styles.error]}>{this.props.signupError}</Text>}
            </View>
            <View style={styles.form}>
              <Field
                name='fullName'
                component={FormTextInput}
                placeholder='Full name'
                placeholderTextColor='white'
                styles={styles}
              />
              <Field
                name='username'
                autoCapitalize='none'
                component={FormTextInput}
                placeholder='Username'
                placeholderTextColor='white'
                styles={styles}
              />
              <Field
                name='email'
                autoCapitalize='none'
                component={FormTextInput}
                placeholder='Email'
                keyboardType='email-address'
                placeholderTextColor='white'
                styles={styles}
              />
              <Field
                name='password'
                autoCapitalize='none'
                component={FormTextInput}
                placeholder='Password'
                secureTextEntry={true}
                placeholderTextColor='white'
                styles={styles}
              />
              <Field
                name='confirmPassword'
                autoCapitalize='none'
                component={FormTextInput}
                placeholder='Confirm password'
                secureTextEntry={true}
                placeholderTextColor='white'
                styles={styles}
              />
              <RoundedButton
                text='Sign Up'
                capitalize={true}
                style={styles.submitButton}
                textStyle={styles.submitText}
                onPress={handleSubmit(this._signup)}
              />
              <TOS styles={[styles.section, styles.tos]} />
            </View>
        </ScrollView>
        {this.props.fetching &&
          <Loader
            style={styles.spinner}
            tintColor={Colors.blackoutTint}
            spinnerColor={Colors.snow}
          />
        }
      </ImageWrapper>
    )
  }
}

const selector = formValueSelector('signupForm')
export default R.compose(
  connect(
    (state) => {
      return {
        fetching: state.signup.fetching,
        hasSignedUp: hasSignedUp(state.signup),
        signupError: state.signup.error,
        fullName: _.trim(selector(state, 'fullName')),
        username: _.trim(selector(state, 'username')),
        email: _.trim(selector(state, 'email')),
        password: _.trim(selector(state, 'password')),
        confirmPassword: _.trim(selector(state, 'confirmPassword')),
      }
    },
    (dispatch) => {
      return {
        attemptSignup: (fullName, username, email, password) => {
          return dispatch(SignupActions.signupEmail(fullName, username, email, password))
        },
      }
    },
  ),
  reduxForm({
    form: 'signupForm',
    destroyOnUnmount: true,
    validate,
    asyncValidate: asyncValidate,
    asyncBlurFields: ['username', 'email'],
    initialValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  }),
)(SignupScreen)
