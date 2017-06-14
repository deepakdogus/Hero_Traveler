import React from 'react'
import { ListView } from 'react-native'
import PropTypes from 'prop-types'

export default class ActivityList extends React.Component {
  static propTypes = {
    activitiesById: PropTypes.arrayOf(
      PropTypes.string
    ),
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.props.activitiesById)
    }
  }

  render () {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.props.renderRow}
        style={this.props.style}
      />
    )
  }
}
