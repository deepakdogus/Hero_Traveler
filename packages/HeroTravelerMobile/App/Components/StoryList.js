import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ListView,
  RefreshControl
} from 'react-native'
import styles from './Styles/StoryListStyle'

/*
add pagingIsDisabled instead of pagingEnabled as a prop so that paging is default
and so we do not need to add the property to (almost) every StoryList call we make
*/
export default class StoryList extends React.Component {
  static propTypes = {
    storiesById: PropTypes.arrayOf(PropTypes.string).isRequired,
    onRefresh: PropTypes.func,
    pagingIsDisabled: PropTypes.bool,
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
    const initialDataSource = props.storiesById.map((id, index) => {
      return {
        id,
        isVisible: index === 0,
      }
    })
    this.state = {
      dataSource: ds.cloneWithRows(initialDataSource),
      visibleRows: {'s1': {0: true}},
    }
  }

  _renderHeader = () => {
    return this.props.renderHeaderContent || null
  }

  _renderSectionHeader = () => {
    return this.props.renderSectionHeader || null
  }

  _renderSeparator = (sectionId, rowId) => {
    const key = sectionId + rowId
    return (
      <View key={key} style={styles.separator}/>
    )
  }

  updateDataSource = (visibleRows) => {
    const updatedDataSource = this.props.storiesById.map((id, index) => {
      return {
        id,
        isVisible: !!visibleRows.s1[index]
      }
    })
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(updatedDataSource)
    })
  }

  render () {
   return (
      <ListView
        key={this.props.storiesById}
        dataSource={this.state.dataSource}
        initialListSize={1}
        renderRow={this.props.renderStory}
        renderHeader={this._renderHeader}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        renderSeparator={this._renderSeparator}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
        onChangeVisibleRows={this.updateDataSource}
        style={[styles.container, this.props.style]}
      />
    )
  }
}
