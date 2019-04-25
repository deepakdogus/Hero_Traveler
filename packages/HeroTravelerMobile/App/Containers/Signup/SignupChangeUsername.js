import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'

import { Actions as NavActions } from 'react-native-router-flux'
import UserActions from '../../Shared/Redux/Entities/Users'
import { Images } from '../../Shared/Themes'
import ImageWrapper from '../../Components/ImageWrapper'
import NavButton from '../../Navigation/NavButton'
import {
  validate as validateOriginal,
  asyncValidate as asyncValidateOriginal,
} from '../../Shared/Lib/userFormValidation'

import styles from './SignupChangeUsernameStyles'

const asyncValidate = (values) => {
  return asyncValidateOriginal(values, null, false, true)
}

const validate = (values) => {
  return validateOriginal(values, null, ['username'])
}

class SignupChangeUsername extends React.Component {
  validationTimeout = null

  static propTypes = {
    user: PropTypes.object,
    updateUser: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      newUsername: '',
      error: null,
      submitted: false,
    }
  }

  conditionalNavForward = () => {
    if (!this.props.user.usernameIsTemporary) {
      NavActions.signupFlow_changeEmail({type: 'reset'})
      this.setState({submitted: true})
    }
  }

  componentDidMount() {
    this.conditionalNavForward()
  }

  componentDidUpdate(){
    this.conditionalNavForward()
  }

  runValidations(values) {
    return new Promise((resolve, reject) => {
      let validationError = validate(values)
      if (Object.keys(validationError).length > 0) {
        reject(validationError[Object.keys(validationError)[0]])
      }
      else {
        asyncValidate(values).then(() => {
          resolve()
        }).catch((err) => {
          reject(err[Object.keys(err)[0]])
        })
      }
    })
  }

  onChangeText = (username) => {
    this.setState({
      newUsername: username,
      error: null,
    })
  }

  onBlur = () => {
    this.runValidations({username: this.state.newUsername}).catch((e) => {
      this.setState({error: e})
    })
  }

  updateUser = () => {
    this.props.updateUser({
      username: this.state.newUsername,
    })
  }

  onRight = () => {
    if (!this.state.error && !this.state.submitting) {
      this.setState({submitting: true}, () => {
        this.runValidations({username: this.state.newUsername}).then(() => {
          this.updateUser()
        }).catch((e) => {
          this.setState({error: e})
        }).finally(() => {
          this.setState({submitting: false})
        })
      })
    }
  }

  getErrorMessage = () => {
    return this.state.error || _.get(this, 'props.error.message')
  }

  render () {
    const error = this.getErrorMessage()
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
              text='Next'
              iconName='arrowRightRed'
            />
          </View>
        </View>
        <View style={[styles.container, styles.root]}>
          <View style={styles.header}>
            <Text style={styles.title}>SIGN UP</Text>
            <Text style={styles.subtitle}>Let&#39;s start by choosing your username</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                returnKeyType={'done'}
                onChangeText={this.onChangeText}
                onBlur={this.onBlur}
                value={this.state.newUsername}
                placeholderTextColor='white'
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error && (
                <View style={styles.errorView}>
                  <Text style={styles.error}>{error}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ImageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    error: state.entities.users.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupChangeUsername)
