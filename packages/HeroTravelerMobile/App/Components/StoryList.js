import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    RefreshControl,
    requireNativeComponent,
} from 'react-native'

import { Metrics } from '../Shared/Themes'
import { connect } from 'react-redux'
import styles from './Styles/StoryListStyle'
import ModifiedListView from './ModifiedListView'
import UXActions from '../Redux/UXRedux'

const NativeFeed = requireNativeComponent('RHNativeFeed', null)
// const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

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
    this.state = {
      visibleCells: undefined,
    }
  }

  

  checkEqual(r1,r2) {
    return r1.id !== r2.id
  }

  _handleVisibleCellsChanged = (event) => {
    this.setState(event.nativeEvent)
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
        let storyViews = []
        let startCell = 0

        if (this.state.visibleCells)
        {
            const {minCell, maxCell} = this.state.visibleCells

            let i = minCell - 1
            storyViews = this.props.storiesById.slice(minCell, maxCell).map((storyId) => {
                i = i + 1
                return (<View key={`FeedItem:${storyId}`}>
                        {this.props.renderStory({id: storyId, index: i})}
                        </View>)
            })
            startCell = minCell
        }

        console.log(`Number of stories about to be shown: ${storyViews.length}`)
         
        return (
                <NativeFeed
            style={[styles.container, this.props.style]}
            cellHeight={Metrics.storyCover.fullScreen.height}
            numCells={this.props.storiesById.length}
            startCell={startCell}
            numPreloadBehindCells={2}
            numPreloadAheadCells={4}
            onVisibleCellsChanged={this._handleVisibleCellsChanged}>
                {storyViews}
                </NativeFeed>
        )
        /*
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
*/
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

