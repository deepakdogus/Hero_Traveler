import React, { PropTypes } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import LoginActions, { isLoggedIn } from '../Redux/LoginRedux'
import { Images } from '../Themes'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/SignupScreenStyles'

class SignupScreen extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoggedIn) {
      this.props.goToMyFeed()
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
          <Text style={styles.title}>Signup</Text>
          <Text style={styles.instructions}>
            Let's start by setting up your account
          </Text>
          <View style={styles.social}>
            <RoundedButton
              style={styles.facebook}
              onPress={this.props.attemptFacebookLogin}
              text='Sign up with Facebook'
            />
            <RoundedButton
              style={styles.twitter}
              text='Sign up with Twitter'
            />
          </View>
        </ScrollView>
      </Image>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: isLoggedIn(state.login)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMyFeed: () => {
      return NavigationActions.tabbar()
    },
    attemptFacebookLogin: () => {
      return dispatch(LoginActions.loginFacebook())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
