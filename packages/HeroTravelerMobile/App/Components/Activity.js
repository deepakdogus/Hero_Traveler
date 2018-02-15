import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { Colors, Metrics } from '../Shared/Themes/'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'

export const ActivityProps = {
  user: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  content: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
}

export default class Activity extends Component {
  static propTypes = ActivityProps

  render () {
    let {
      user,
      description,
      content,
      createdAt,
      seen,
    } = this.props
    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.innerButton}>
            <Avatar
              style={styles.avatar}
              avatarUrl={getImageUrl(user.profile.avatar, 'avatar')}
            />
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.actionUserText}>{user.profile.fullName} </Text>
                <Text>{description}</Text>
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
                {moment(createdAt).fromNow()}
              </Text>
            </View>
            {!seen &&
              <Icon name='circle' size={10} color={Colors.redLight}/>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {activityId, seen, onPress} = this.props
    if (onPress) {
      onPress(activityId, seen)
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
    flex: .7,
    marginLeft: Metrics.baseMargin,
  },
  dateText: {
    marginTop: Metrics.baseMargin / 2,
    color: '#757575',
  },
  content: {
    marginTop: Metrics.baseMargin / 2
  },
  contentText: {
    color: '#757575',
    fontSize: 15
  },
  description: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '300',
    // fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: 0.7,
  },
  avatar: {
    marginHorizontal: Metrics.baseMargin
  },
  actionUserText: {
    fontWeight: '600',
    color: Colors.background,
  }
})
