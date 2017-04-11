import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { Colors, Metrics, Fonts } from '../Themes/'
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
              avatarUrl={fromUser.profile.avatar}
            />
            <View style={[styles.middle]}>
              <Text style={styles.usernameText}>
                {fromUser.profile.fullName}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.messageText,
                  isUnread ? {color: Colors.background} : {}
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
    fontWeight: '800'
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
