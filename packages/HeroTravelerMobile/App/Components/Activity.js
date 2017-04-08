import React, {PropTypes, Component} from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { Colors, Metrics, Fonts } from '../Themes/'
import Avatar from '../Components/Avatar'

export const ActivityProps = {
  user: PropTypes.object,
  actionUser: PropTypes.object,
  description: PropTypes.string,
  content: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date)
}

export default class Activity extends Component {
  static propTypes = ActivityProps

  render () {
    let {
      actionUser,
      description,
      content,
      onPress,
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
              avatarUrl={actionUser.profile.avatar}
            />
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.actionUserText}>{actionUser.profile.fullName} </Text>
                <Text>{description}.</Text>
              </Text>
              {content &&
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
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {story, onPress} = this.props
    if (onPress) {
      onPress(story)
    }
  }

  _onPressLike = () => {
    const {story, onPressLike} = this.props
    if (onPressLike) {
      onPressLike(story)
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
    fontWeight: 'bold'
  }
})
