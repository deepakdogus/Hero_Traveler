import React from 'react'
import _ from 'lodash'
import {
  View,
  Text,
  TextInput
} from 'react-native'
import {
  Actions as NavActions
} from 'react-native-router-flux'
import RoundedButton from '../Components/RoundedButton'
import Loader from '../Components/Loader'
import { connect } from 'react-redux'
import {Colors} from '../Shared/Themes'
import styles from './Styles/ChangePasswordScreenStyles'
import LoginActions from '../Shared/Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import UserActions from '../Shared/Redux/Entities/Users'
import {validate as validateOriginal, asyncValidate as asyncValidateOriginal} from '../Shared/Lib/userFormValidation'

const asyncValidate = (values) => {
  return asyncValidateOriginal(values)
}

const validate = (values) => {
  return validateOriginal(values, null, ["email"])
}

class ChangePasswordScreen extends React.Component {
  validationTimeout = null

  constructor(props) {
    super(props)
    this.state = {
      newEmail: this.props.user.email,
      error: null
    }
  }

  runValidations(values) {
    return new Promise((resolve, reject) => {
      let validationError = validate(values)
      if (Object.keys(validationError).length > 0) {
        reject(validationError[Object.keys(validationError)[0]])
      } else {
        asyncValidate(values).then(() => {
          resolve()
        }).catch((err) =>  {
          reject(err[Object.keys(err)[0]])
        })
      }
    })
  }

  onChangeText = (email) => {
    this.setState({
      newEmail: email,
      error: null
    })
  }

  onBlur = () => {
    this.runValidations({email: this.state.newEmail}).catch((e) => {
      this.setState({error: e})
    })
  }

  updateUser = () => {
    this.props.updateUser({
      email: this.state.newEmail,
    })
  }

  onSubmit = () => {
    if (!this.state.error && !this.state.submitting) {
      if (this.state.newEmail === this.props.user.email) {
        return;
      }
      this.setState({submitting: true}, () => {
        this.runValidations({email: this.state.newEmail}).then(() => {
          this.updateUser()
          NavActions.pop()
        }).catch((e) => {
          this.setState({validationError: e, submitting: false})
        })
      })
    }
  }

  render () {
    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.separator} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoFocus
              returnKeyType={'done'}
              onChangeText={this.onChangeText}
              onBlur={this.onBlur}
              value={this.state.newEmail}
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>
        <View style={styles.separator}>
          <View style={styles.buttonWrapper}>
            <RoundedButton
              text='Cancel'
              textStyle={{color: Colors.blackoutTint}}
              style={styles.cancelButton}
              onPress={NavActions.pop}
            />
            <RoundedButton
              text='Change Email'
              textStyle={{color: Colors.snow}}
              style={styles.submitButton}
              onPress={this.onSubmit}
            />
          </View>
          <Text style={styles.errorWrapper}>
            {this.state.validationError && <Text style={[styles.section, styles.error]}>{this.state.validationError}</Text>}
          </Text>
        </View>
        {this.state.updating &&
          <Loader tintColor={Colors.blackoutTint} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }} />
        }
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen)
