import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import HockeyApp from 'react-native-hockeyapp'
import { connect } from 'react-redux'
import { Router } from 'react-native-router-flux'

import NavigationScenes from '../Navigation/NavigationRouter'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import styles from './Styles/RootContainerStyles'

const ConnectedRouter = connect()(Router)

class RootContainer extends Component {

  componentWillMount() {
    HockeyApp.configure('26a928f9ecc44c0baf17350581dc9405')
  }

  componentDidMount () {
    HockeyApp.start()

    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ConnectedRouter scenes={NavigationScenes} />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
