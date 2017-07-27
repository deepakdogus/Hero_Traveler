import React from 'react'
import PropTypes from 'prop-types'
import { ListView } from 'react-native'

export default class List extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    renderRow: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.items)
    }
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

  // _renderRow = (user) => {
  //   return (
  //     <UserListItem
  //       titleStyle={this.props.titleStyle}
  //       subtitleStyle={this.props.subtitleStyle}
  //       key={user.id || user._id}
  //       user={user}
  //       onPress={this._onPress}
  //     />
  //   )
  // }
  //
  // _onPress = (user) => {
  //   if (this.props.onPress) {
  //     this.props.onPress(user)
  //   }
  // }

}
