import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions, ActionConst as NavActionConst } from 'react-native-router-flux'

import {hasAuthData} from '../Redux/SessionRedux'
import RoundedButton from '../Components/RoundedButton'
import TextButton from '../Components/TextButton'
import { Images } from '../Themes'
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends React.Component {

  componentWillReceiveProps(newProps) {
    if (!this.props.isLoggedIn && newProps.isLoggedIn) {
      NavigationActions.tabbar({type: NavActionConst.REPLACE})
    }
  }

  render () {
    return (
      <Image
        source={Images.launchBackground}
        style={[styles.backgroundImage]}
      >
        <View style={[styles.logoSection]}>
          <Image source={Images.whiteLogo} style={styles.logo} />
          <Text
            style={styles.tagline}
            textAlign='center'
          >{'Share Your Adventures with the World'}</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.signupButtons}>
          <RoundedButton
            style={styles.facebook}
            text='Sign up with Facebook'
          />
          <RoundedButton
            style={styles.twitter}
            text='Sign up with Twitter'
          />
          <RoundedButton
            style={styles.email}
            onPress={NavigationActions.signup}
            text='Sign up with Email'
          />
        </View>
        <View style={styles.loginWrapper}>
          <Text style={styles.tosText}>Already have an account?&nbsp;</Text>
          <TextButton
            style={[styles.tosText, styles.loginText]}
            onPress={NavigationActions.login}
            text='Log In'
          />
        </View>
      </Image>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: hasAuthData(state.session)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
