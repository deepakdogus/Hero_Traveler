import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from './Styles/GuideStoriesOfTypeStyles'
import getImageUrl from '../Shared/Lib/getImageUrl'
import ImageWrapper from './ImageWrapper'

class GuideStoriesOfType extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    isShowAll: PropTypes.bool,
    storyIds: PropTypes.arrayOf(PropTypes.string),
    stories: PropTypes.arrayOf(PropTypes.object),
    onPressAll: PropTypes.func
  }

  setShowAll = () => {
    this.props.onPressAll(this.props.type)
  }

  renderStory = (story) => {
    const imageUrl = getImageUrl(story.coverImage, 'basic')
    const {authors} = this.props

    return (
      <View key={story.id} style={styles.storyView}>
        <ImageWrapper
          cached
          source={{uri: imageUrl}}
          style={styles.image}
        />
        <Text style={styles.title}>
          {story.title}
        </Text>
        <Text style={styles.author}>
          {authors[story.author].username}
        </Text>
      </View>
    )
  }

  render () {
    const {label, stories, isShowAll} = this.props
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>
          {label}
        </Text>
        <View style={styles.storiesWrapper}>
          {stories.map((story, index) => {
            if (!isShowAll && index >= 4) return null
            return this.renderStory(story)
          })}
        </View>
        <TouchableOpacity onPress={this.setShowAll}>
          <View style={styles.seeAllView}>
            <Text style={styles.seeAll}>
              See all ({stories.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const allStories = state.entities.stories.entities
  const allUsers = state.entities.users.entities
  const authors = {}
  return {
    stories: props.storyIds.map(id => {
      const story = allStories[id]
      if (!authors[story.author]) {
        authors[story.author] = allUsers[story.author]
      }
      return story
    }),
    authors,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideStoriesOfType)
