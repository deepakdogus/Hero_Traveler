import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import styles from './Styles/StoryPreviewStyle'

/*
TODO:
- make Views the height of the container
- add gradient overlay to bottom of image opacity #000 0.3
- refactor styles into module
 */

export default class StoryPreview extends React.Component {
  _onPress(title){
    alert(`story ${this.props.story.title} pressed`)
  }

  render () {
    let {
      story: {
          coverImage,
          title,
          description,
          author: {
            fullName
          },
          likes,
          createdAt
      }
    } = this.props;

    return (

      <TouchableHighlight onPress={()=>this._onPress(title)}>
        <View style={{flex: 1, height: 300, flexDirection: "row"}}>
          <Image
            resizeMode="cover"
            source={{uri: coverImage}}
            style={[styles.backgroundImage, {flexDirection: "column", justifyContent: "flex-end"}]}
          >
            <View style={{padding: 16}}>
              <Text style={{fontSize: 28, fontWeight: "200", color: "white", letterSpacing: 1.5}}>{title.toUpperCase()}</Text>
              <Text style={{fontSize: 16, color: "#e0e0e0", letterSpacing:0.7}}>{description}</Text>
              <View style={{height: 1, width: 300, backgroundColor: "#fff", opacity: 0.5}}></View>
              <View style={{width: 300, marginTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                  <Image style={{height: 36, width: 36, borderRadius: 18, marginRight: 5}} source={{uri: coverImage}}></Image>
                  <Text style={{color: "#e0e0e0", fontWeight: "300", fontSize: 15}}>{fullName}</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{color: "#e0e0e0", fontStyle: "italic", marginRight: 5}}>2 days ago</Text>
                  <Text style={{color: "#e0e0e0", fontStyle: "italic"}}>{likes} likes</Text>
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
