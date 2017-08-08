import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
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
    renderHeaderContent: PropTypes.object,
    renderSectionHeader: PropTypes.object,
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

  _renderHeader = () => {
    return this.props.renderHeaderContent || null
  }

  _renderSectionHeader = () => {
    return this.props.renderSectionHeader || null
  }

  render () {
    return (
      <ListView
        key={this.props.storiesById}
        dataSource={this.state.dataSource}
        pagingEnabled={true}
        initialListSize={1}
        renderRow={this.props.renderStory}
        renderHeader={this._renderHeader}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
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
