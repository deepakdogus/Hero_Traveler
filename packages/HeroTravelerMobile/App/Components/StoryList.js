import React, { PropTypes } from 'react'
import { ListView } from 'react-native'
import styles from './Styles/StoryListStyle'

import StoryPreview from '../Components/StoryPreview'

export default class StoryList extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    stories: PropTypes.array,
    onPressLike: PropTypes.func,
    onPressStory: PropTypes.func
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.stories)
    }
  }

  render () {
    let { stories } = this.props;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderStory}
        style={[styles.container]}
      />
    )
  }

  _renderStory = (story) => {
    return (
      <StoryPreview
        key={story._id}
        height={this.props.height}
        story={story}
        onPress={this._onPressStory}
        onPressLike={this._onPressLike}
      />
    )
  }

  _onPressStory = (story) => {
    if (this.props.onPressStory) {
      this.props.onPressStory(story)
    }
  }

  _onPressLike = (story) => {
    if (this.props.onPressLike) {
      this.props.onPressLike(story)
    }
  }
}
