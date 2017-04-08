import React, { PropTypes } from 'react'
import { ListView } from 'react-native'

import Activity, {ActivityProps} from './Activity'

export default class ActivityList extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(
      PropTypes.shape(ActivityProps)
    ),
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
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        style={this.props.style}
      />
    )
  }

  _renderRow = (activity) => {
    return (
      <Activity
        {...activity}
        key={activity.id}
        onPress={this.props.onPress}
      />
    )
  }
}
