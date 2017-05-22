import _ from 'lodash'
import React, { PropTypes } from 'react'
import {
  ListView,
  RefreshControl
} from 'react-native'
import styles from './Styles/StoryListStyle'

import StoryPreview from '../Components/StoryPreview'

export default class StoryList extends React.Component {
  static propTypes = {
    storiesById: PropTypes.arrayOf(PropTypes.string).isRequired,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
  }

  static defaultProps = {
    refreshing: false
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => _.isEqual(r1, r2)})
    this.state = {
      dataSource: ds.cloneWithRows(props.storiesById)
    }
  }

  render () {
    return (
      <ListView
        key={this.props.storiesById}
        dataSource={this.state.dataSource}
        pagingEnabled={true}
        renderRow={this.props.renderStory}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
        style={[styles.container, this.props.style]}
      />
    )
  }
}
