import React from 'react'
import PropTypes from 'prop-types'
import { ListView } from 'react-native'

import ThreadListItem, {ThreadListItemProps} from './ThreadListItem'

export default class ThreadList extends React.Component {
  static propTypes = {
    threads: PropTypes.arrayOf(
      PropTypes.shape(ThreadListItemProps)
    ),
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.threads)
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

  _renderRow = (thread) => {
    return (
      <ThreadListItem
        {...thread}
        key={thread.id}
        onPress={this.props.onPress}
      />
    )
  }
}
