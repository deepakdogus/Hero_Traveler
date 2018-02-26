import React from 'react'
import { ListView, Text } from 'react-native'
import PropTypes from 'prop-types'
import SyncListItem from './SyncListItem'

export default class ActivityList extends React.Component {
  static propTypes = {
    backgroundFailures: PropTypes.object,
    publishLocalDraft: PropTypes.func,
    updateDraft: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.props.backgroundFailures)
    }
  }

  renderRow = (failObject) => {
    return (
      <SyncListItem
        publishLocalDraft={this.props.publishLocalDraft}
        updateDraft={this.props.updateDraft}
        {...failObject}
      />
    )
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.backgroundFailures).length !== Object.keys(nextProps.backgroundFailures).length) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      this.setState({
        dataSource:ds.cloneWithRows(nextProps.backgroundFailures)
      })
    }
  }

  render () {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        style={this.props.style}
      />
    )
  }
}
