import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions, ActionConst as NavActionConst } from 'react-native-router-flux'

import {hasAuthData} from '../Redux/SessionRedux'
import RoundedButton from '../Components/RoundedButton'
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
        style={styles.backgroundImage}
      >
        <View style={[styles.section, styles.centered]}>
          <Image source={Images.whiteLogo} style={styles.logo} />
          <Text
            style={styles.tagline}
            textAlign='center'
          >{'Share your adventures with the world.'}</Text>
        </View>
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
          <Text style={styles.instructions}>Already have an account?</Text>
          <RoundedButton
            style={styles.login}
            onPress={NavigationActions.login}
            text='Login'
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
