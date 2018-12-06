import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { Colors, Metrics } from '../Shared/Themes/'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {
  getDescription,
  getContent,
  getAvatar,
  getUsername,
} from '../Shared/Lib/NotificationHelpers'

export default class Activity extends Component {
  static propTypes = {
  onPress: PropTypes.func,
  activity: PropTypes.object,
}

  render () {
    let { activity } = this.props
    const content = getContent(activity)

    const avatar = getAvatar(activity)
    const username = getUsername(activity)

    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.innerButton}>
              <Avatar
                style={styles.avatar}
                avatarUrl={
                  avatar
                  ? getImageUrl(avatar, 'avatar')
                  : null
                }
              />
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.actionUserText}>
                  {username || 'A user'}
                </Text>
                <Text> {getDescription(activity)}</Text>
              </Text>
              {!!content &&
                <View style={styles.content}>
                  <Text
                    numberOfLines={2}
                    style={styles.contentText}
                  >
                    {content}
                  </Text>
                </View>
              }
              <Text style={styles.dateText}>
                {moment(activity.createdAt).fromNow()}
              </Text>
            </View>
            {!activity.seen &&
              <Icon name='circle' size={10} color={Colors.redLight}/>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {activity, onPress} = this.props
    if (onPress) {
      onPress(activity.id, activity.seen)
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 1,
  },
  innerButton: {
    flexDirection: 'row',
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
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
  avatar: {
    marginHorizontal: Metrics.baseMargin,
  },
  actionUserText: {
    fontWeight: '600',
    color: Colors.background,
  },
})
