import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import RoundedButton from '../Components/RoundedButton'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Colors} from '../Shared/Themes'
import API from '../Shared/Services/HeroAPI'
import styles, { listHeight } from './Styles/CommentsScreenStyles'
import StoryActions from '../Shared/Redux/Entities/Stories'
import StoryCommentActions from '../Shared/Redux//Entities/StoryComments'
import GuideActions from '../Shared/Redux/Entities/Guides'
import GuideCommentsActions from '../Shared/Redux/Entities/GuideComments';

const api = API.create()

const Comment = ({avatar, name, comment, timestamp}) => {
  return (
    <View style={styles.commentWrapper}>
      <View style={styles.comment}>
        <Avatar avatarUrl={avatar} size='almostExtraSmall' />
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
  static propTypes = {
    accessToken: PropTypes.object,
    storyId: PropTypes.string,
    guideId: PropTypes.string,
    updateStory: PropTypes.func,
    updateLocalGuide: PropTypes.func,
    user: PropTypes.object,
    createStoryComment: PropTypes.func,
  };

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
        const getMethod = this.props.storyId ? api.getComments : api.getGuideComments
        getMethod(this.props.storyId || this.props.guideId)
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

    if (this.state.text.trim().length=== 0) return

    this.input.blur()
    const newComment = {
      user: this.props.user,
      createdAt: Date.now(),
      content: this.state.text,
      story: this.props.storyId
    };

    this.props.storyId ?
      this.props.createStoryComment(this.state.text) :
      this.props.createGuideComment(this.state.text)

      this.setState({
        comments: [
          ...this.state.comments,
          newComment
        ],
        text: '',
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
                  avatar={getImageUrl(comment.user.profile.avatar, 'avatar')}
                  name={comment.user.profile.fullName}
                  comment={comment.content}
                  timestamp={moment(comment.createdAt).fromNow()}
                  key={comment.createdAt.toString()}
                />
                )})}
            </ScrollView>
            <View>
              <View style={styles.inputGroupWrapper}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder='Add a comment'
                    style={styles.input}
                    value={this.state.text}
                    autoCapitalize='none'
                    onSubmitEditing={this.setFocusedFalse}
                    onFocus={this.setFocusedTrue}
                    onBlur={this.setFocusedFalse}
                    onChangeText={this.setChangedText}
                    autoCorrect={false}
                    returnKeyType={'done'}
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateStory: (story) => dispatch(StoryActions.receiveStories(story)),
    updateLocalGuide: (guide) => dispatch(GuideActions.receiveGuides(guide)),
    createStoryComment: (text) => dispatch(StoryCommentActions.createCommentRequest(ownProps.storyId, text)),
    createGuideComment: (text) => dispatch(GuideCommentsActions.createGuidesCommentRequest(ownProps.guideId, text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCommentsScreen)
