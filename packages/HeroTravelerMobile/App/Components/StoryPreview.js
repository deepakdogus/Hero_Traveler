import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import styles from './Styles/StoryPreviewStyle'
import { Metrics } from '../Themes'

/*
TODO:
- add gradient overlay to bottom of image opacity #000 0.3
- Fix the navbar height / photo height issue
- populate story with user data
 */

export default class StoryPreview extends React.Component {
  _onPress(title){
    alert(`story ${this.props.story.title} pressed`)
  }

  render () {
    let { story } = this.props,
      { coverImage,
        title,
        description,
        author: {
          username
        },
        likes,
        createdAt
      } = story;

    return (
      <TouchableHighlight onPress={()=>this._onPress(title)} style={styles.storyPreviewContainer}>
        <View style={styles.contentContainer}>
          <Image
            resizeMode="cover"
            source={{uri: coverImage}}
            style={[styles.backgroundImage, styles.previewImage]}
          >
            <View style={styles.previewInfo}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
              <Text style={styles.subtitle}>{description}</Text>
              <View style={styles.divider}></View>
              <View style={styles.detailContainer}>
                <View style={styles.row}>
                  <Image style={styles.avatar} source={{uri: coverImage}}></Image>
                  <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.bottomRight}>2 days ago</Text>
                  <Text style={styles.bottomRight}>{likes} likes</Text>
                </View>
              </View>
            </View>
          </Image>
        </View>
      </TouchableHighlight>
    )
  }
}

// // Prop type warnings
// StoryPreview.propTypes = {
//   someProperty: React.PropTypes.object,
//   someSetting: React.PropTypes.bool.isRequired
// }
//
// // Defaults for props
// StoryPreview.defaultProps = {
//   someSetting: false
// }
