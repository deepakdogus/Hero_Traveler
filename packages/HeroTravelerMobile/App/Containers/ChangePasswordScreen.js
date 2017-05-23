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
import { Field, reduxForm, formValueSelector } from 'redux-form'
import RoundedButton from '../Components/RoundedButton'
import Loader from '../Components/Loader'
import { connect } from 'react-redux'
import {Colors} from '../Themes'
import styles from './Styles/ChangePasswordScreenStyles'
/* import LoginActions from '../Redux/LoginRedux'*/
import HeroAPI from '../Services/HeroAPI'
import LoginActions from '../Redux/LoginRedux'

const api = HeroAPI.create()

class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentText: '',
      newText: '',
    }
  }

  conponentDidMount (){
    console.log('this.props.accessToken', this.props.accessToken)
    api.setAuth(this.props.accessToken)
  }

  handleSubmit = (userId, password) => {
    if (this.state.newText.length < 8 || this.state.newText.length > 64) {
      this.setState({validationError: 'password must be between 8 and 64 characters long'})
      return
    }
    console.log('this.props.accessToken', this.props.accessToken)
    console.log('function called with: ', this.props.userId, this.state.newText)
    return api.changePassword(this.props.userId, this.state.newText)
  }

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
              onChangeText={(text) => this.setState({currentText: text})}
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
              onChangeText={(text) => this.setState({newText: text})}
              autoCorrect={false}
            />
          </View>
        <View style={styles.separator}>
          <View style={styles.buttonWrapper}>
            <RoundedButton
              text='Cancel'
              textStyle={{color: Colors.blackoutTint}}
              style={styles.cancelButton}
              onPress={() => NavActions.pop()}
            />
            <RoundedButton
              text='Save Password'
              textStyle={{color: Colors.snow}}
              style={styles.submitButton}
              onPress={() => this.handleSubmit()}
            />
            <Text>
              {this.state.validationError && <Text style={[styles.section, styles.error]}>{this.state.validationError}</Text>}
            </Text>
          </View>
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
  console.log('state', state)
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
