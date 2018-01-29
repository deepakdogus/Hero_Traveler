import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableOpacity} from 'react-native'

import styles from './Styles/StoryReadingToolbarStyles'
import TabIcon from './TabIcon'

export default class StoryReadingToolbarComponent extends Component {

  static propTypes = {
    onPressLike: PropTypes.func,
    onPressComment: PropTypes.func,
    onPressBookmark: PropTypes.func,
    onPressShare: PropTypes.func,
    onPressFlag: PropTypes.func,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    likeCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    commentCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    boomarkCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  render() {
    let likeComponent,
        commentComponent,
        bookmarkComponent,
        shareComponent,
        flagButton
    const likeContainer = (
      <View style={styles.wrapper}>
        <Text
          style={styles.text}
        >
          {this.props.likeCount || 0}
        </Text>
        <TabIcon
          name={this.props.isLiked ? 'like-active' : 'like'}
          style={{image: styles.heartIcon}}
        />
      </View>
    )

    const commentContainer = (
      <View style={styles.wrapper}>
        <Text
          style={styles.text}
        >
          {this.props.commentCount || 0}
        </Text>
        <TabIcon name={'comment'}/>
      </View>
    )

    const bookmarkContainer = (
      <View style={styles.wrapper}>
        <Text
          style={styles.text}
        >
          {this.props.boomarkCount || 0}
        </Text>
        <TabIcon name={this.props.isBookmarked ? 'bookmark-active' : 'bookmark'}/>
      </View>
    )

    const shareContainer = (
      <View style={styles.wrapper}>
        <TabIcon
          name={'share'}
          style={{image: styles.shareIcon}}
        />
      </View>
    )

    const flagComponent = (
      <View style={styles.wrapper}>
        <TabIcon
          name={'flag'}
          style={{image: styles.flagIcon}}
        />
      </View>
    )


    if(this.props.onPressLike) {
      likeComponent = (
        <TouchableOpacity
          style={styles.likeTool}
          onPress={this.props.onPressLike}
          children={likeContainer}
        />
      )
    } else {
      likeComponent = (
        <View style={styles.likeTool} children={likeContainer} />
      )
    }

    if(this.props.onPressComment) {
      commentComponent = (
        <TouchableOpacity
          style={styles.commentTool}
          onPress={this.props.onPressComment}
          children={commentContainer}
        />
      )
    } else {
      commentComponent = (
        <View style={styles.commentTool} children={commentContainer} />
      )
    }

    if(this.props.onPressBookmark) {
      bookmarkComponent = (
        <TouchableOpacity
          style={styles.bookmarkTool}
          onPress={this.props.onPressBookmark}
          children={bookmarkContainer}
        />
      )
    } else {
      bookmarkComponent = (
        <View style={styles.bookmarkTool} children={bookmarkContainer} />
      )
    }

    if(this.props.onPressShare) {
      shareComponent = (
        <TouchableOpacity
          style={styles.shareTool}
          onPress={this.props.onPressShare}
          children={shareContainer}
        />
      )
    } else {
      shareComponent = (
        <View style={styles.shareTool} children={shareContainer} />
      )
    }

    if (this.props.onPressFlag) {
      flagButton = (
        <TouchableOpacity
          style={styles.shareTool}
          onPress={this.props.onPressFlag}
          children={flagComponent}
        />
      )
    } else {
      flagButton = (
        <View style={styles.shareTool} children={flagComponent} />
      )
    }

    return (
      <View style={[styles.root, this.props.style]}>
        {likeComponent}
        {commentComponent}
        {bookmarkComponent}
        {/**shareComponent**/}
        {flagButton}
      </View>
    )
  }

}
