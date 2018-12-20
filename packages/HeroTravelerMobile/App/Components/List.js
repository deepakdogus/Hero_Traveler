import React from 'react'
import PropTypes from 'prop-types'
import { ListView } from 'react-native'

export default class List extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    renderRow: PropTypes.func.isRequired,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.items),
    }
  }

  componentWillReceiveProps(nextProps) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.setState({dataSource: ds.cloneWithRows(nextProps.items)})
  }

  render () {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.props.renderRow}
        style={[{flex: 1}, this.props.style]}
      />
    )
  }
}
