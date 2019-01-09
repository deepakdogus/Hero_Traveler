import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { Colors, Metrics } from '../Shared/Themes/'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {
  getDescriptionText,
  getContent,
  getAvatar,
  getUsername,
  getUserId,
  ActivityTypes,
  getFeedItemTitle,
} from '../Shared/Lib/NotificationHelpers'
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'

export default class Activity extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    activity: PropTypes.object,
    markSeen: PropTypes.func,
  }

  _markSeen = () => {
    const {
      activity: { seen, id },
      markSeen,
    } = this.props
    if (!seen) markSeen(id)
  }

  _navToUser = () => {
    const { activity } = this.props
    NavActions.readOnlyProfile({ userId: getUserId(activity) })
  }

  _navToReadingScreen = () => {
    const { activity } = this.props
    const type
      = activity.kind === ActivityTypes.like
      || activity.kind === ActivityTypes.comment
        ? 'story'
        : 'guide'
    NavActions[type]({
      [`${type}Id`]: activity[type]._id,
      title: displayLocationPreview(activity[type].locationInfo),
    })
  }

  render() {
    let { activity } = this.props
    const content = getContent(activity)

    const avatar = getAvatar(activity)
    const username = getUsername(activity)

    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={this._markSeen}>
          <View style={styles.container}>
            <TouchableOpacity onPress={this._navToUser}>
              <Avatar
                avatarUrl={avatar ? getImageUrl(avatar, 'avatar') : null}
              />
            </TouchableOpacity>
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.actionText} onPress={this._navToUser}>
                  {`${username} ` || 'A user '}
                </Text>
                <Text>{getDescriptionText(activity)}</Text>
                <Text
                  style={styles.actionText}
                  onPress={this._navToReadingScreen}
                >
                  {getFeedItemTitle(activity)}
                </Text>
              </Text>
              {!!content && (
                <View style={styles.content}>
                  <Text numberOfLines={2} style={styles.contentText}>
                    {content}
                  </Text>
                </View>
              )}
              <Text style={styles.dateText}>
                {moment(activity.createdAt).fromNow()}
              </Text>
            </View>
            {!activity.seen && (
              <Icon name="circle" size={10} color={Colors.redLight} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  middle: {
    width: Metrics.screenWidth - 40 * 1.5 - Metrics.doubleBaseMargin * 2 - 50,
    marginLeft: Metrics.baseMargin,
  },
  dateText: {
    marginTop: Metrics.baseMargin / 2,
    color: '#757575',
  },
  content: {
    marginTop: Metrics.baseMargin / 2,
  },
  contentText: {
    color: '#757575',
    fontSize: 15,
  },
  description: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '300',
    letterSpacing: 0.7,
  },
  descriptionClickContainer: {
    height: '100%',
    width: '100%',
  },
  actionText: {
    fontWeight: '600',
    color: Colors.background,
  },
})
