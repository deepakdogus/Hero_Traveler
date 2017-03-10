import React, { Component } from 'react'
import { Scene, Router, Modal } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import NavigationDrawer from './NavigationDrawer'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import SignupScreen from '../Containers/SignupScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={Modal} open={false}>
          <Scene key='root' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
            <Scene key='signup' component={SignupScreen} title='' hideNavBar={false} />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
