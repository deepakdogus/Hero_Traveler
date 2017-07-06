import _ from 'lodash'
import React from 'react'
import { Text, View, ScrollView, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

import RoundedButton from '../Components/RoundedButton'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Colors} from '../Shared/Themes'
import API from '../Shared/Services/HeroAPI'
import styles, { listHeight } from './Styles/StoryCommentsScreenStyles'
import StoryActions from '../Shared/Redux/Entities/Stories'

const api = API.create()

const Comment = ({avatar, name, comment, timestamp}) => {
  return (
    <View style={styles.commentWrapper}>
      <View style={styles.comment}>
        {avatar && <Image style={styles.avatar} source={{uri: avatar }} />}
        {!avatar && <Icon name='user-circle-o' style={styles.iconAvatar} size={36} />}
        <View style={styles.commentTextWrapper}>
          <View style={styles.nameAndTimeStamp}>
            <Text style={styles.commentName}>{name}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
      </View>
    </View>
  )
}

class StoryCommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      text: '',
      comments: [],
      isFocused: false,
    }
  }

  componentDidMount() {
    api.setAuth(this.props.accessToken.value)
      .then(() => {
        api.getComments(this.props.storyId)
          .then(({data}) => {
            this.setState({
              loading: false,
              comments: data
            })
          })
      })
  }

  isValid() {
    return this.state.text.trim().length
  }

  handleSend = () => {
    // blur to hide keyboard
    this.input.blur()
    const newComment = {
      user: this.props.user,
      createdAt: Date.now(),
      content: this.state.text,
      story: this.props.storyId
    };

    api.createComment(
      this.props.storyId,
      this.state.text
    )
    .then(() => {
      const update = {}
      update[this.props.storyId] = {
        counts: {
          comments: this.state.comments.length + 1,
        }
      }
      this.props.updateStory(update)

      this.setState({
        comments: [
          ...this.state.comments,
          newComment
        ],
        text: '',
      })
    })
  }

  _setRef = i => this._scrollView = i

  _onContentSizeChange = () => {
    if (this.state.comments.length > 6) {
      this._scrollView.scrollToEnd({animated: true})
    }
  }

  setFocusedTrue = () => {
    this.setState({isFocused: true})
  }

  setFocusedFalse = () => {
    this.setState({isFocused: false})
  }

  setChangedText = (text) => {
    this.setState({text: text})
  }

  setInputRef = (input) => {
    this.input = input
  }

  render () {
    return (
          <View style={[styles.containerWithNavbar]}>
            <ScrollView
              ref={this._setRef}
              onContentSizeChange={this._onContentSizeChange}
              style={[
                styles.list,
                this.state.isFocused ? {height: listHeight - 295} : {}
              ]}>
            {this.state.comments.map(comment => {
              return(
                <Comment
                  avatar={getImageUrl(comment.user.profile.avatar)}
                  name={comment.user.profile.fullName}
                  comment={comment.content}
                  timestamp={moment(comment.createdAt).fromNow()}
                  key={comment.createdAt.toString()}
                />
                )})}
            </ScrollView>
            <KeyboardAvoidingView
              behavior='padding'
              contentContainerStyle={{}}
              style={[styles.root]}>
              <View>
                <View style={styles.inputGroupWrapper}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      autoFocus
                      placeholder='Add a comment'
                      style={styles.input}
                      value={this.state.text}
                      autoCapitalize='none'
                      onSubmitEditing={this.handleSend}
                      onFocus={this.setFocusedTrue}
                      onBlur={this.setFocusedFalse}
                      onChangeText={this.setChangedText}
                      autoCorrect={false}
                      returnKeyType={'send'}
                      ref={this.setInputRef}
                    />
                  </View>
                  <RoundedButton
                    style={[
                      styles.inputButton,
                      {backgroundColor: this.isValid() ? Colors.red : Colors.inactiveRed},
                    ]}
                    onPress={this.handleSend}
                  >
                    Send
                  </RoundedButton>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    accessToken: _.find(state.session.tokens, {type: 'access'})
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateStory: (story) => dispatch(StoryActions.receiveStories(story))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCommentsScreen)
