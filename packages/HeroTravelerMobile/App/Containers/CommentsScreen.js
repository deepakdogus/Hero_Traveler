import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import RoundedButton from '../Components/RoundedButton'
import Avatar from '../Components/Avatar'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {Colors} from '../Shared/Themes'
import styles, { listHeight } from './Styles/CommentsScreenStyles'
import CommentActions from '../Shared/Redux/Entities/Comments'

const Comment = ({avatarUrl, name, comment, timestamp}) => {
  return (
    <View style={styles.commentWrapper}>
      <View style={styles.comment}>
        <Avatar avatarUrl={avatarUrl} size='almostExtraSmall' />
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

Comment.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  comment: PropTypes.string,
  timestamp: PropTypes.string,
}

class CommentsScreen extends React.Component {
  static propTypes = {
    storyId: PropTypes.string,
    guideId: PropTypes.string,
    user: PropTypes.object,
    comments: PropTypes.object,
    createComment: PropTypes.func,
    getComments: PropTypes.func,
  };

  constructor(props) {
    super(props)

    this.state = {
      text: '',
      isFocused: false,
    }
  }

  componentDidMount() {
    this.props.storyId
      ? this.props.getComments(this.props.storyId, 'story')
      : this.props.getComments(this.props.guideId, 'guide')
  }

  isValid() {
    return this.state.text.trim().length
  }

  handleSend = () => {
    if (this.state.text.trim().length === 0) return

    // blur to hide keyboard
    this.input.blur()
    this.props.storyId
      ? this.props.createComment(this.props.storyId, 'story', this.state.text)
      : this.props.createComment(this.props.guideId, 'guide', this.state.text)

    this.setState({
      text: '',
    })
  }

  _setRef = i => this._scrollView = i

  _onContentSizeChange = () => {
    let {comments, storyId, guideId} = this.props
    storyId
      ? comments = comments['story'][storyId] || []
      : comments = comments['guide'][guideId] || []

    if (comments.length > 6) {
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
    let {comments, storyId, guideId} = this.props
    storyId
      ? comments = comments['story'][storyId]
      : comments = comments['guide'][guideId]

    return (
      <View style={[
        styles.containerWithNavbar,
        styles.listContainer]}
      >
        <ScrollView
          ref={this._setRef}
          onContentSizeChange={this._onContentSizeChange}
          style={[
            styles.list,
            this.state.isFocused ? {height: listHeight - 295} : {},
          ]}
        >
          {comments && comments.map(comment => {
            const { user } = comment
            const [ userAvatar, userFullName ] = user && user.profile
              ? [user.profile.avatar, user.profile.fullName]
              : [undefined, undefined]

            return (
              <Comment
                avatarUrl={getImageUrl(userAvatar, 'avatar')}
                name={userFullName}
                comment={comment.content}
                timestamp={moment(comment.createdAt).fromNow()}
                key={comment.createdAt.toString()}
              />
            )
          })}
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
    comments: state.entities.comments,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComments: (feedItemId, entityType) => dispatch(CommentActions.getCommentsRequest(feedItemId, entityType)),
    createComment: (feedItemId, entityType, text) => dispatch(CommentActions.createCommentRequest(feedItemId, entityType, text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen)
