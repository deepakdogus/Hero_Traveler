import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment'

import { Colors, Metrics } from '../Shared/Themes/'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from '../Components/Avatar'

export const ThreadListItemProps = {
  isUnread: PropTypes.bool,
  fromUser: PropTypes.object,
  message: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date)
}

export default class ThreadListItem extends Component {
  static propTypes = ThreadListItemProps

  render () {
    let {
      isUnread,
      fromUser,
      message,
      createdAt,
    } = this.props
    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.innerButton}>
            <Avatar
              style={styles.avatar}
              avatarUrl={getImageUrl(fromUser.profile.avatar, 'avatar')}
            />
            <View style={[styles.middle]}>
              <Text style={styles.usernameText}>
                {fromUser.profile.fullName}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.messageText,
                  isUnread ? {
                    color: Colors.background,
                    fontWeight: '700'
                  } : {}
                ]}
              >
                {message}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {moment(createdAt).fromNow()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // @TODO
  _onPress = () => {
    const {onPress} = this.props
    if (onPress) {
      onPress()
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
    flexDirection: "row",
    paddingVertical: Metrics.baseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
  },
  middle: {
    flex: 0.65,
    marginLeft: Metrics.baseMargin,
  },
  usernameText: {
    color: Colors.background,
    fontWeight: '600'
  },
  dateText: {
    flex: .25,
    marginLeft: Metrics.baseMargin,
    color: '#757575',
    fontSize: 12,
    textAlign: 'right'
  },
  messageText: {
    fontSize: 16,
    color: '#757575',
  },
  avatar: {
    marginHorizontal: Metrics.baseMargin
  },
  actionUserText: {
    fontWeight: 'bold'
  }
})
