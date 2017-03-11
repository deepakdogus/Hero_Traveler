import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/MyFeedScreenStyles'

class ProfileScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Profile</Text>
        <RoundedButton
          onPress={this.props.logout}
          text='Logout'
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(LoginActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
