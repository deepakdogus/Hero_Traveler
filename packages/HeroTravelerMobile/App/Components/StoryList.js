import React, { PropTypes } from 'react'
import { View, Text } from 'react-native'
import styles from './Styles/StoryListStyle'

import StoryPreview from '../Components/StoryPreview'

export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.array
  };

  render () {
    let { stories } = this.props;

    return (
      <View style={[styles.container]}>
        { stories.map( (story, idx) => <StoryPreview story={story} key={idx} />)}
      </View>
    )
  }
}
