import _ from 'lodash'
import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'

import { connect } from 'react-redux'
import UserActions from '../../Shared/Redux/Entities/Users'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import Loader from '../../Components/Loader'
import styles from '../Styles/NotificationScreenStyles'
import ActivityList from '../../Components/ActivityList'
import Activity from '../../Components/Activity'
import ThreadList from '../../Components/ThreadList'
import SyncList from '../../Components/SyncList'
import Colors from '../../Shared/Themes/Colors'
import NotificationBadge from '../../Components/NotificationBadge'

const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment'
}

const Tab = ({text, onPress, selected, notificationCount, width}) => {
  return (
    <TouchableOpacity style={[
        styles.tab, selected ? styles.tabSelected : null,
        {width}
      ]}
      onPress={onPress}
    >
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
    this.state = { selectedTab: this.getSyncLength() ? 2 : 0}
  }


  componentWillMount() {
    this.props.getActivity()
  }

  getSyncLength() {
    if (this.props.backgroundFailures)
    {
      return Object.keys(this.props.backgroundFailures).length
    }
    return 0
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

  componentWillReceiveProps(nextProps){
    if (
        this.state.selectedTab === 2 &&
        (!nextProps.backgroundFailures || Object.keys(nextProps.backgroundFailures).length === 0)
    ) this.setState({selectedTab: 0})
  }

  render () {
    let content

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
    } else if (this.state.selectedTab === 2) {
      content = (
        <SyncList
          backgroundFailures={this.props.backgroundFailures || {}}
          publishLocalDraft={this.props.publishLocalDraft}
          updateDraft={this.props.updateDraft}
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

            // quick fix to solve for notifications crash
            if ((activity.kind === ActivityTypes.like && (!activity.story || !activity.fromUser)) ||
              (activity.kind === ActivityTypes.follow && !activity.user) ||
              (activity.kind === ActivityTypes.comment && (!activity.story || !activity.fromUser))) {
              if (!activity.seen) this._pressActivity(activity.id, false)
              return null
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

    const syncLength = this.getSyncLength()
    const tabWidth = syncLength ? '50%' : '100%'

    return (
      <ScrollView style={styles.containerWithNavbar}>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            {!!syncLength &&
              <Tab
                notificationCount={syncLength}
                selected={this.state.selectedTab === 2}
                onPress={() => this.setState({selectedTab: 2})}
                text='SYNC'
                width={tabWidth}
              />
            }
            <Tab
              notificationCount={unseenActivities}
              selected={this.state.selectedTab === 0}
              onPress={() => this.setState({selectedTab: 0})}
              text='ACTIVITY'
              width={tabWidth}
            />
          {
            // <Tab
            //   notificationCount={0}
            //   selected={this.state.selectedTab === 1}
            //   onPress={() => this.setState({selectedTab: 1})}
            //   text='INBOX'
            //   width={tabWidth}
            // />
          }
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
    }],
    backgroundFailures: state.entities.stories.backgroundFailures || {},
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActivity: () => dispatch(UserActions.fetchActivities()),
    markSeen: (activityId) => dispatch(UserActions.activitySeen(activityId)),
    publishLocalDraft: (story) => dispatch(StoryCreateActions.publishLocalDraft(story)),
    updateDraft: (story) => dispatch(StoryCreateActions.updateDraft(story.id, story, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen)
