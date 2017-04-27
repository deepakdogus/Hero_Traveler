import React from 'react'
import {
  View,
  TouchableOpacity,
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
import SessionActions, {hasAuthData} from '../Redux/SessionRedux'
import {Colors} from '../Themes'
import styles from './Styles/ChangePasswordScreenStyles'

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentText: '',
      newText: '',
      updating: false,
      validationError: ''
    }
  }  

  handleSubmit = () => {
  if (this.state.newText.length < 8 || this.state.newText.length > 64) {
    this.setState({validationError: 'password must be between 8 and 64 characters long'})
    return
  }
   return alert(this.state.newText); 
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

// const mapStateToProps = (state) => {
//   return {
//     user: state.entities.users.entities[state.session.userId],
//     isLoggedIn: !state.session.isLoggedOut,
//     loggingOut: state.session.isLoggingOut,
//     tokens: state.session.tokens
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     logout: (tokens) => dispatch(SessionActions.logout(tokens)),
//     resetStore: () => dispatch(SessionActions.resetRootStore())
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
