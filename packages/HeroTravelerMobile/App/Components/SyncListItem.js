import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

import { Colors, Metrics } from '../Shared/Themes/'
import Avatar from './Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'

export const ActivityProps = {
  story: PropTypes.object.isRequired,
  failedMethod: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  publishLocalDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
}

export default class Activity extends Component {
  static propTypes = ActivityProps

  isRetrying(){
    return this.props.status === 'retrying'
  }

  render () {
    let {
      story,
      error,
    } = this.props

    let cover = story.coverImage || story.coverVideo
    let imageUrl
    if (typeof cover === 'string') cover = JSON.parse(cover)
    if (cover.uri || cover.secure_url){
      imageUrl = cover.uri || cover.secure_url
    }
    else imageUrl = getImageUrl(cover, 'basic')
    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={this._onPress}
        >
          <View style={styles.innerButton}>
            <Avatar
              style={styles.avatar}
              avatarUrl={imageUrl}
            />
            <View style={styles.middle}>
              <Text style={styles.description}>
                <Text style={styles.actionUserText}>{story.title}</Text>
                <Text> {error}</Text>
              </Text>
            </View>
            <View style={styles.end}>
              {this.isRetrying() &&
                <ActivityIndicator size='small' color={Colors.background}/>
              }
              {!this.isRetrying() && <Text style={styles.retry}>RETRY</Text>}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _onPress = () => {
    const {story, failedMethod} = this.props
    this.props[failedMethod](story)
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
    flex: .5,
    marginLeft: Metrics.baseMargin,
    justifyContent: 'center',
  },
  end: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  retry: {
    fontSize: 14,
    color: Colors.background,
    fontWeight: '300',
    letterSpacing: 0.7,
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
