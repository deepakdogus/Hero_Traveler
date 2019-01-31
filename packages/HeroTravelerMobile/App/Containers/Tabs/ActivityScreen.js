import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import PushNotification from 'react-native-push-notification'

import UserActions from '../../Shared/Redux/Entities/Users'
import Loader from '../../Components/Loader'
import styles from '../Styles/NotificationScreenStyles'
import ActivityList from '../../Components/ActivityList'
import Activity from '../../Components/Activity'
import ThreadList from '../../Components/ThreadList'
import Colors from '../../Shared/Themes/Colors'
import NotificationBadge from '../../Components/NotificationBadge'
import {
  isActivityIncomplete,
  getPopulatedActivity,
} from '../../Shared/Lib/NotificationHelpers'

const Tab = ({
  text,
  onPress,
  selected,
  notificationCount,
  width = '100%',
}) => {
  return (
    <TouchableOpacity
      style={[styles.tab, selected ? styles.tabSelected : null, { width }]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>
        {text}
      </Text>
      {notificationCount > 0 && (
        <NotificationBadge
          style={{
            position: 'relative',
            top: -10,
            right: -5,
          }}
          count={notificationCount}
        />
      )}
    </TouchableOpacity>
  )
}

Tab.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  notificationCount: PropTypes.number,
  width: PropTypes.string,
}

class NotificationScreen extends React.Component {
  static propTypes = {
    getActivity: PropTypes.func,
    backgroundFailures: PropTypes.array,
    activities: PropTypes.object,
    markSeen: PropTypes.func,
    activitiesById: PropTypes.array,
    threads: PropTypes.array,
    fetchStatus: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = { selectedTab: 0 }
  }

  componentWillMount() {
    this.props.getActivity()
  }

  componentDidMount() {
    // We can assume that it's safe to clear the notifications count
    // from the app icon.
    PushNotification.setApplicationIconBadgeNumber(0)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activities) {
      _.map(nextProps.activities, activity => {
        if (!activity.seen) nextProps.markSeen(activity._id)
      })
    }
  }

  _displayThreadAlert = () => alert('Navigate to thread')

  _setSelectedTab = () => this.setState({ selectedTab: 0 })

  renderRow = activityId => {
    const populatedActivity = getPopulatedActivity(activityId, this.props)

    return (
      <Activity
        key={activityId}
        activity={populatedActivity}
        markSeen={this.props.markSeen}
      />
    )
  }

  render() {
    let content
    const { activitiesById, activities, threads, fetchStatus } = this.props
    const unseenActivities = _.size(
      _.filter(
        _.map(activitiesById, aid => ({ ...activities[aid] })),
        activity => {
          return !activity.seen
        },
      ),
    )

    // TODO: add back when fetching is tied to notification message subscriptions
    //
    // if (fetchStatus.fetching) {
    //   content = <Loader spinnerColor={Colors.blackoutTint} />
    // }
    // else if (this.state.selectedTab === 1) {
    if (this.state.selectedTab === 1) {
      content = (
        <ThreadList
          threads={threads}
          onPress={this._displayThreadAlert}
        />
      )
    }
    else {
      const filteredActivities = activitiesById.filter(id => {
        const activity = getPopulatedActivity(id, this.props)
        return !isActivityIncomplete(activity)
      })

      content = (
        <ActivityList
          style={styles.activityList}
          activitiesById={filteredActivities}
          renderRow={this.renderRow}
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
              onPress={this._setSelectedTab}
              text="ACTIVITY"
            />
            {
              // <Tab
              //   notificationCount={0}
              //   selected={this.state.selectedTab === 1}
              //   onPress={() => this.setState({selectedTab: 1})}
              //   text='INBOX'
              // />
            }
          </View>
          <View style={styles.tabContent}>{content}</View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => {
  const users = state.entities.users.entities
  const user = state.entities.users.entities[state.session.userId]

  return {
    state,
    user,
    users,
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    activitiesById: state.entities.users.activitiesById,
    activities: state.entities.users.activities,
    fetchStatus: state.entities.users.fetchStatus,
    threads: [
      {
        id: 2,
        isUnread: true,
        fromUser: _.values(users)[_.random(0, users.length - 1)],
        message:
          "I tried to contact you via phone, but it went straight to voicemail. I'm concerned that our last post is not very good",
        createdAt: moment()
          .subtract(3, 'days')
          .toDate(),
      },
      {
        id: 1,
        isUnread: false,
        fromUser: user,
        message: 'This is a cool app',
        createdAt: moment()
          .subtract(3, 'days')
          .toDate(),
      },
    ],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getActivity: () => dispatch(UserActions.fetchActivities()),
    markSeen: activityId => dispatch(UserActions.activitySeen(activityId)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationScreen)
