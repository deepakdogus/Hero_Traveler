import React from 'react'
import {
  View,
  Text,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'

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

  constructor(props) {
    super(props)
    this.state = {
      newUsername: '',
      error: null,
    }
  }

  componentDidMount() {
    if (!this.props.user.usernameIsTemporary) {
      NavActions.signupFlow_changeEmail()
    }
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
          NavActions.signupFlow_changeEmail()
        }).catch((e) => {
          this.setState({error: e})
        }).finally(() => {
          this.setState({submitting: false})
        })
      })
    }
  }

  render () {
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
              {this.state.error && (
                <View style={styles.errorView}>
                  <Text style={styles.error}>{this.state.error}</Text>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch(UserActions.updateUser(attrs)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupChangeUsername)
