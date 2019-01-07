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
import PropTypes from 'prop-types'
import RoundedButton from '../Components/RoundedButton'
import Loader from '../Components/Loader'
import { connect } from 'react-redux'
import {Colors} from '../Shared/Themes'
import styles from './Styles/ChangePasswordScreenStyles'
import LoginActions from '../Shared/Redux/LoginRedux'

class ChangePasswordScreen extends React.Component {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    changePassword: PropTypes.func.isRequired,
    passwordError: PropTypes.object,
    isFetching: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      currentText: '',
      newText: '',
      validationError: null,
    }
  }

  componentDidUpdate(prevProps){
    if (!prevProps.passwordError && this.props.passwordError) {
      this.setState({validationError: this.props.passwordError.message})
    }
    //removes validation error if you previously failed, then succeeded in changing password
    if (prevProps.passwordError && !this.props.passwordError) {
      this.setState({validationError: ''})
    }
    //upon succesfully changing password
    if (prevProps.isFetching && (!this.props.isFetching && !this.props.passwordError)) {
      NavActions.pop()
      alert('Your password has been successfully changed')
    }
  }

  _handleSubmit = () => {
    if (this.state.newText.length < 8 || this.state.newText.length > 64) {
       this.setState({validationError: 'password must be between 8 and 64 characters long'})
       return
    } else {
      this.props.changePassword(this.props.userId, this.state.currentText, this.state.newText)
    }
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
              placeholderTextColor={Colors.grey}
              autoFocus
              value={this.state.currentText}
              autoCapitalize='none'
              onChangeText={this._setText}
              autoCorrect={false}
              secureTextEntry={true}
            />
          </View>
        <View style={styles.separator} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='New Password'
              placeholderTextColor={Colors.grey}
              autoFocus
              value={this.state.newText}
              autoCapitalize='none'
              onChangeText={this._setNewText}
              autoCorrect={false}
              secureTextEntry={true}
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
          <Loader
            tintColor={Colors.blackoutTint}
            style={styles.spinner}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.session.userId,
    accessToken: _.find(state.session.tokens, {type: 'access'}).value,
    passwordError: state.login.error,
    isFetching: state.login.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (userId, oldPassword, newPassword) => dispatch(LoginActions.changePasswordRequest(userId, oldPassword, newPassword))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen)
