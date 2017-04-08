import React, { PropTypes } from 'react'
import { ListView } from 'react-native'

import Activity, {ActivityProps} from './Activity'
import StoryPreview from './StoryPreview'

export default class ActivityList extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    activities: PropTypes.arrayOf(PropTypes.shape(ActivityProps)),
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.activities)
    }
  }

  render () {
    let { activities } = this.props;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        style={this.props.style}
      />
    )
  }

  _renderRow = (activity) => {
    console.log('activity', activity)
    return (
      <Activity
        {...activity}
        onPress={this._onPress}
      />
    )
  }

  _onPress = (activity) => {
    if (this.props.onPress) {
      this.props.onPress(activity)
    }
  }

  _onPressLike = (story) => {
    if (this.props.onPressLike) {
      this.props.onPressLike(story)
    }
  }
}
