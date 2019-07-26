import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'

export default class ActivityList extends React.Component {
  static propTypes = {
    activitiesById: PropTypes.arrayOf(PropTypes.string),
    keyExtractor: PropTypes.func,
    onPress: PropTypes.func,
    renderItem: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  }

  render = () => (
    <FlatList
      data={this.props.activitiesById}
      keyExtractor={this.keyExtractor}
      renderItem={this.props.renderRow}
      style={this.props.style}
    />
  )
}
