import React, { PropTypes } from 'react'
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import SignupActions, {hasSignedUp} from '../Redux/SignupRedux'
import { Images } from '../Themes'
import RoundedButton from '../Components/RoundedButton'
import TOS from '../Components/TosFooter'

// styles
import styles from './Styles/SignupScreenStyles'

class Input extends React.Component {
  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          {...this.props}
        />
      </View>
    )
  }
}

class SignupScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.fetching && newProps.hasSignedUp) {
      NavigationActions.signupFlow()
    }
  }

  _signup = () => {
    if (!this.props.fetching) {
      this.props.attemptSignup(
        this.state.fullName,
        this.state.username,
        this.state.email,
        this.state.password
      )
    }
  }

  render () {
    return (
      <Image
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={10}
      >
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.instructions}>
              Let's start by setting up your account
            </Text>
          </View>
          <View style={styles.form}>
            <Input
              onChangeText={(fullName) => this.setState({fullName}) }
              value={this.state.fullName}
              placeholder="Full name"
            />
            <Input
              autoCapitalize="none"
              onChangeText={(username) => this.setState({username}) }
              value={this.state.username}
              placeholder="Username"
            />
            <Input
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email}) }
              value={this.state.email}
              placeholder="Email"
              keyboardType="email-address"
            />
            <Input
              autoCapitalize="none"
              onChangeText={(password) => this.setState({password}) }
              value={this.state.password}
              placeholder="Password"
              secureTextEntry={true}
            />
            <Input
              autoCapitalize="none"
              onChangeText={(confirmPassword) => this.setState({confirmPassword}) }
              value={this.state.confirmPassword}
              placeholder="Confirm password"
              secureTextEntry={true}
            />
            <RoundedButton
              text="SIGN UP"
              onPress={this._signup}
            />
            {this.props.signupError && <Text style={[styles.section, styles.error]}>{this.props.signupError}</Text>}

            <TOS styles={[styles.section, styles.tos]} />
          </View>
        </ScrollView>
      </Image>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.signup.fetching,
    hasSignedUp: hasSignedUp(state.signup),
    signupError: state.signup.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: (fullName, username, email, password) => {
      return dispatch(SignupActions.signupEmail(fullName, username, email, password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
