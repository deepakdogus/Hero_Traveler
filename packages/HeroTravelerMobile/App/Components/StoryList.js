import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/StoryListStyle'
import ModifiedListView from './ModifiedListView'
import UXActions from '../Redux/UXRedux'

/*
add pagingIsDisabled instead of pagingEnabled as a prop so that paging is default
and so we do not need to add the property to (almost) every StoryList call we make
*/
class StoryList extends React.Component {
  static propTypes = {
    storiesById: PropTypes.arrayOf(PropTypes.string).isRequired,
    onRefresh: PropTypes.func,
    pagingIsDisabled: PropTypes.bool,
    refreshing: PropTypes.bool,
    renderHeaderContent: PropTypes.object,
    renderSectionHeader: PropTypes.object,
    setPlayingRow: PropTypes.func,
    setVisibleRows: PropTypes.func,
    playingRow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    refreshing: false
  }

  constructor(props) {
    super(props)
    const ds = new ModifiedListView.DataSource({rowHasChanged: this.checkEqual})
    const initialDataSource = props.storiesById.map((id, index) => {
      return {
        id,
        index,
      }
    })
    this.state = {
      dataSource: ds.cloneWithRows(initialDataSource),
      visibleRows: {'s1': {'-1': true}},
    }
  }

  checkEqual(r1,r2) {
    return r1.id !== r2.id
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
    const {setPlayingRow, playingRow, setVisibleRows} = this.props

    if (!visibleRows || !visibleRows.s1)
    {
      return;
    }

    let targetRow;
    const visibleRowsKeys = Object.keys(visibleRows.s1)
    if (visibleRowsKeys.length === 3) targetRow = visibleRowsKeys[1]
    else targetRow = visibleRowsKeys[0]
    if (targetRow !== playingRow) setPlayingRow(targetRow)
    setVisibleRows(visibleRowsKeys)
  }

  render () {
    return (
      <ModifiedListView
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

const mapStateToProps = (state) => {
  return {
    playingRow: state.ux.storyListPlayingRow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPlayingRow: (row) => dispatch(UXActions.setStoryListPlayingRow(row)),
    setVisibleRows: (rows) => dispatch(UXActions.setStoryListVisibleRows(rows)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryList)

