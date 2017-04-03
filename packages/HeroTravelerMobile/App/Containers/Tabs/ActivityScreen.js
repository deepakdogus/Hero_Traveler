import React from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
// Styles
import styles from '../Styles/NotificationScreenStyles'
import ActivityList from '../../Components/ActivityList'
import StoryActions from '../../Redux/StoryRedux'


const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

class NotificationScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = { selectedTab: 0 }
  }


  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.user._id)
  }

  _wrapElt(elt){
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }
  _showLoader(){
   return (
     <Text style={styles.message}>Loading</Text>
   )
  }

  _showError(){
    return (
      <Text style={styles.message}>Error</Text>
    )
  }

  _showNoActivity(){
    return (
      <Text style={styles.title}>There is no activity here</Text>
    )
  }

  _showNoInbox(){
    return (
      <Text style={styles.title}>Inbox Empty!</Text>
    )
  }
    render () {

      let { posts: activities, users, fetching, error } = this.props
      let content

      if (fetching || error) {
        let innerContent = fetching ? this._showLoader() : this._showError()
        content = this._wrapElt(innerContent);
      }
      if (this.state.selectedTab === 1 ) {
        content = ( <ActivityList
          style={styles.activityList}
          activities={activities}
          height={50}
          onPressActivity={() => alert('Activity navigation function goes here')}
          /> )
      } else {
        content = (
          <ActivityList
          style={styles.inboxList}
          activities={activities}
          height={90}
          onPressActivity={() => alert('Inbox navigation function goes here')}
        /> ) 
      }

    return (
      <ScrollView style={styles.containerWithNavbar}>
      <View style={styles.tabs}>
      <View style={styles.tabnav}>
      <Tab selected={this.state.selectedTab === 0} onPress={() => this.setState({selectedTab: 0})} text='ACTIVITY' />
      <Tab selected={this.state.selectedTab === 1} onPress={() => this.setState({selectedTab: 1})} text='INBOX' />
      </View>

      {content}
          </View>
      </ScrollView>
    )
  }
}


const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    user: state.session.user,
    fetching,
    posts,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: (userId) => {
      return dispatch(StoryActions.feedRequest(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)
