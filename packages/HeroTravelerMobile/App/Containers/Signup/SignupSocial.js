import React from 'react'
import {
  ScrollView,
  Image,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import SignupActions from '../../Redux/SignupRedux'
import UserActions from '../../Redux/UserRedux'
import RoundedButton from '../../Components/RoundedButton'
import ExploreGrid from '../../Components/ExploreGrid'
import {Colors} from '../../Themes'
import styles from './SignupSocialStyles'

class SignupSocialScreen extends React.Component {

  componentDidMount() {
    this.props.loadSuggestedPeople()
  }

  render () {
    let content

    if (this.props.users.length) {
      content = (
        <View style={styles.lightBG}>
          <Text style={styles.sectionHeader}>FIND FRIENDS</Text>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='facebook'
                size={15}
                color={Colors.facebookBlue} />
              <Text style={styles.connectSocialText}>Facebook</Text>
              <View style={styles.connectWrapper}>
                <Text style={styles.isConnectedText}>Connected</Text>
                <Icon name='angle-right' size={15} color={'#757575'} />
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='twitter' size={15} color={Colors.twitterBlue} />
              <Text style={styles.connectSocialText}>Twitter</Text>
              <View style={styles.connectWrapper}>
                <Icon name='angle-right' size={15} color={'#757575'} />
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <Icon name='instagram' size={15} color={Colors.twitterBlue} />
              <Text style={styles.connectSocialText}>Instagram</Text>
              <View style={styles.connectWrapper}>
                <Icon name='angle-right' size={15} color='#757575' />
              </View>
            </View>
          </View>
          <Text style={styles.sectionHeader}>SUGGESTED PEOPLE</Text>
          {this.props.users.map(u => {
            return (
              <View style={[styles.rowWrapper]} key={u._id}>
                <View style={[styles.row, styles.followers]}>
                  <Image style={styles.avatar} source={{uri: u.profile.avatar}} />
                  <View style={styles.nameWrapper}>
                    <Text style={styles.name}>{u.profile.fullName}</Text>
                    <Text style={styles.followerCount}>100 followers</Text>
                  </View>
                  <RoundedButton
                    style={styles.followersButton}
                    textStyle={styles.followersButtonText}
                    text='FOLLOWING'
                  />
                </View>
              </View>
            )
          })}
        </View>
      )
    } else {
      content = (
        <Text>No users yet</Text>
      )
    }

    return (
      <ScrollView style={[styles.containerWithNavbar, styles.root]}>
        <View style={styles.header}>
          <Text style={styles.title}>FOLLOW</Text>
          <Text style={styles.subtitle}>Follow people to see their trips</Text>
        </View>
        {content}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSuggestedPeople: () => dispatch(UserActions.loadUserSuggestionsRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupSocialScreen)
