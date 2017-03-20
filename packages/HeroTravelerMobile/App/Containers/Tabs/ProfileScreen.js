import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions, ActionConst as NavActionConst } from 'react-native-router-flux'
import SessionActions, {hasAuthData} from '../../Redux/SessionRedux'
import RoundedButton from '../../Components/RoundedButton'

// Styles
import styles from '../Styles/MyFeedScreenStyles'

class ProfileScreen extends React.Component {

  componentWillReceiveProps(newProps) {
    if (this.props.isLoggedIn && !newProps.isLoggedIn) {
      NavActions.launchScreen({type: NavActionConst.REPLACE})
    }
  }

  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Profile</Text>
        <RoundedButton
          onPress={() => this.props.logout(this.props.apiTokens)}
          text='Logout'
        />
        <RoundedButton
          onPress={this._getMyToken}
          text='Token'
        />
      </ScrollView>
    )
  }

  _getMyToken = () => {
    return alert(JSON.stringify(this.props.apiTokens))
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: hasAuthData(state.session),
    apiTokens: state.session.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (tokens) => dispatch(SessionActions.logout(tokens))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
