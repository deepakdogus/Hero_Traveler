import _ from 'lodash'
import React from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native'
import moment from 'moment'

import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import Loader from '../../Components/Loader'
import styles from '../Styles/NotificationScreenStyles'
import ActivityList from '../../Components/ActivityList'
import ThreadList from '../../Components/ThreadList'
import StoryActions from '../../Redux/Entities/Stories'


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


  // componentDidMount() {
  //   this.props.getActivity()
  // }

  _wrapElt(elt){
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }

  _showNoActivity() {
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
    let content

    if (this.state.selectedTab === 1 ) {
      content = ( <ThreadList
        style={styles.threadList}
        threads={this.props.threads}
        onPress={() => alert('Navigate to thread')}
        /> )
    } else {
      content = (
        <ActivityList
          style={styles.activityList}
          activities={this.props.activities}
          onPress={() => alert('Navigate to activity')}
        />
      )
    }

    return (
      <ScrollView style={styles.containerWithNavbar}>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            <Tab selected={this.state.selectedTab === 0} onPress={() => this.setState({selectedTab: 0})} text='ACTIVITY' />
            <Tab selected={this.state.selectedTab === 1} onPress={() => this.setState({selectedTab: 1})} text='INBOX' />
          </View>
          <View style={styles.tabContent}>
            {content}
          </View>
        </View>
      </ScrollView>
    )
  }
}


const mapStateToProps = (state) => {
  const users = state.entities.users.entities
  const user = state.session.user
  return {
    user,
    users,
    activities: [
      {
        id: 1,
        actionUser: _.values(users)[_.random(0, users.length - 1)],
        user: user,
        description: 'commented on your story',
        content: 'That place looks amazing! I so want to go here on vacation!!',
        createdAt: moment().subtract(5, 'hours').toDate()
      }, {
        id: 2,
        actionUser: _.values(users)[_.random(0, users.length - 1)],
        user: user,
        description: 'is now following you',
        createdAt: moment().subtract(1, 'day').toDate()
      }
    ],
    threads: [{
      id: 2,
      isUnread: true,
      fromUser: _.values(users)[_.random(0, users.length - 1)],
      message: 'I tried to contact you via phone, but it went straight to voicemail. I\'m concerned that our last post is not very good',
      createdAt: moment().subtract(3, '6').toDate()
    }, {
      id: 1,
      isUnread: false,
      fromUser: user,
      message: 'This is a cool app',
      createdAt: moment().subtract(3, 'days').toDate()
    }]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getActivity: (userId) => {
    //   return dispatch(StoryActions.feedRequest(userId))
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)
