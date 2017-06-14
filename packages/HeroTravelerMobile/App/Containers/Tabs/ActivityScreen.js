import _ from 'lodash'
import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import PushNotification from 'react-native-push-notification'

import { connect } from 'react-redux'
import UserActions from '../../Redux/Entities/Users'
import Loader from '../../Components/Loader'
import styles from '../Styles/NotificationScreenStyles'
import ActivityList from '../../Components/ActivityList'
import Activity from '../../Components/Activity'
import ThreadList from '../../Components/ThreadList'
import Colors from '../../Themes/Colors'
import NotificationBadge from '../../Components/NotificationBadge'

const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment'
}

const Tab = ({text, onPress, selected, notificationCount}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
      {notificationCount > 0 &&
        <NotificationBadge
          style={{
            position: 'relative',
            top: -10,
            right: -5
          }}
          count={notificationCount} />
      }
    </TouchableOpacity>
  )
}

const ConnectedActivity = connect(
  (state, props) => {
    const activities = state.entities.users.activities
    return {
      seen: activities[props.activityId].seen
    }
  }
)(Activity)

class NotificationScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = { selectedTab: 0 }
  }


  componentWillMount() {
    this.props.getActivity()
  }

  _pressActivity = (activityId, seen) => {
    if (!seen) {
      this.props.markSeen(activityId)
    }
  }

  getDescription(activity) {
    switch (activity.kind) {
      case ActivityTypes.follow:
        return `is now following you.`
      case ActivityTypes.comment:
        return  `commented on your story ${activity.story.title}.`
      case ActivityTypes.like:
        return `liked your story ${activity.story.title}.`
    }
  }

  getContent(activity) {
    switch (activity.kind) {
      case ActivityTypes.comment:
        return 'test'
    }
  }

  render () {
    let content

    console.log('this.props', this.props)

    // PushNotification.getApplicationIconBadgeNumber(num => {
    //   console.log('# of notifications', num)
    // })

    const unseenActivities = _.size(_.filter(_.map(this.props.activitiesById, aid => ({...this.props.activities[aid]})), activity => {
      return !activity.seen
    }))

    if (this.props.fetchStatus.fetching) {
      content = (
        <Loader spinnerColor={Colors.blackoutTint} />
      )
    } else if (this.state.selectedTab === 1 ) {
      content = (
        <ThreadList
          threads={this.props.threads}
          onPress={() => alert('Navigate to thread')}
        />
      )
    } else {
      content = (
        <ActivityList
          style={styles.activityList}
          activitiesById={this.props.activitiesById}
          renderRow={(activityId) => {

            const activity = {
              ...this.props.activities[activityId],
              user: this.props.users[
                this.props.activities[activityId].fromUser
              ],
              story: this.props.stories[
                this.props.activities[activityId].story
              ]
            }

            return (
              <ConnectedActivity
                key={activityId}
                activityId={activityId}
                createdAt={activity.createdAt}
                description={this.getDescription(activity)}
                content={this.getContent(activity)}
                user={activity.user}
                onPress={this._pressActivity}
              />
            )
          }}
        />
      )
    }

    return (
      <ScrollView style={styles.containerWithNavbar}>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            <Tab
              notificationCount={unseenActivities}
              selected={this.state.selectedTab === 0}
              onPress={() => this.setState({selectedTab: 0})}
              text='ACTIVITY'
            />
            <Tab
              notificationCount={0}
              selected={this.state.selectedTab === 1}
              onPress={() => this.setState({selectedTab: 1})}
              text='INBOX'
            />
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
  const user = state.entities.users.entities[state.session.userId]
  return {
    user,
    users,
    stories: state.entities.stories.entities,
    activitiesById: state.entities.users.activitiesById,
    activities: state.entities.users.activities,
    fetchStatus: state.entities.users.fetchStatus,
    threads: [{
      id: 2,
      isUnread: true,
      fromUser: _.values(users)[_.random(0, users.length - 1)],
      message: 'I tried to contact you via phone, but it went straight to voicemail. I\'m concerned that our last post is not very good',
      createdAt: moment().subtract(3, 'days').toDate()
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
    getActivity: () => dispatch(UserActions.fetchActivities()),
    markSeen: (activityId) => dispatch(UserActions.activitySeen(activityId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)
