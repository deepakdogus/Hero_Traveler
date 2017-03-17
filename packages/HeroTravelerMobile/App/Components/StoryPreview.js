import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import styles from './Styles/StoryPreviewStyle'
import { Metrics, Images } from '../Themes'
import LinearGradient from 'react-native-linear-gradient';

/*
TODO:
- Fix the Navar height issue
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
          username,
          profileAvatar
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
            <LinearGradient colors={['transparent', 'black']} style={styles.previewInfo}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
              <Text style={styles.subtitle}>{description}</Text>
              <View style={styles.divider}></View>
              <View style={styles.detailContainer}>
                <View style={styles.row}>
                  <Image style={styles.avatar} source={{uri: profileAvatar}}></Image>
                  <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.bottomRight}>2 days ago</Text>
                  <Text style={styles.bottomRight}>{likes}</Text>
                </View>
              </View>
            </LinearGradient>
          </Image>
        </View>
      </TouchableHighlight>
    )
  }
}
