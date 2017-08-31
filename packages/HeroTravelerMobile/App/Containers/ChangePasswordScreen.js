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
import HeroAPI from '../Shared/Services/HeroAPI'
import LoginActions from '../Shared/Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'

const api = HeroAPI.create()

class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentText: '',
      newText: '',
      validationError: null,
    }
  }

  _handleSubmit = () => {
    if (this.state.newText.length < 8 || this.state.newText.length > 64) {
      this.setState({validationError: 'password must be between 8 and 64 characters long'})
      return
    }
    return api.setAuth(this.props.accessToken)
    .then(() => {
      return api.changePassword(this.props.userId, this.state.currentText, this.state.newText)
      .then((res) => {
        if (!res.ok) this.setState({validationError: 'We were unable to reset your password. Please verify your old password is correct.'})
        else {
          NavigationActions.pop()
          alert("Password changed!")
        }
      })
    })
  }

  _setText = (currentText) => this.setState({currentText})

  _setNewText = (newText) => this.setState({newText})

  render () {
    return (
      <View style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.separator} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Current Password'
              placeholderTextColor='#757575'
              autoFocus
              value={this.state.currentText}
              autoCapitalize='none'
              onChangeText={this._setText}
              autoCorrect={false}
            />
          </View>
        <View style={styles.separator} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='New Password'
              placeholderTextColor='#757575'
              autoFocus
              value={this.state.newText}
              autoCapitalize='none'
              onChangeText={this._setNewText}
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
              text='Save Password'
              textStyle={{color: Colors.snow}}
              style={styles.submitButton}
              onPress={this._handleSubmit}
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
    userId: state.session.userId,
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (userId, password) => dispatch(LoginActions.changePassword(userId, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen)
