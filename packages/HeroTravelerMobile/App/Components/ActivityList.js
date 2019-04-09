import React from 'react'
import { ListView } from 'react-native'
import PropTypes from 'prop-types'

export default class ActivityList extends React.Component {
  static propTypes = {
    activitiesById: PropTypes.arrayOf(
      PropTypes.string,
    ),
    onPress: PropTypes.func,
    renderRow: PropTypes.func,
    style: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.props.activitiesById),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activitiesById.length !== this.props.activitiesById.length) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      this.setState({dataSource: ds.cloneWithRows(nextProps.activitiesById)})
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
