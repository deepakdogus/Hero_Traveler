import _ from 'lodash'
import React from 'react'
import { Text, View, ScrollView, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

import RoundedButton from '../Components/RoundedButton'
import getImageUrl from '../Lib/getImageUrl'
import API from '../Services/HeroAPI'
import styles from './Styles/StoryCommentsScreenStyles'

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
      comments: []
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

  handleSend = () => {
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

  _setText = (text) => this.setState({text})

  render () {
    return (
        <KeyboardAvoidingView
          behavior={this.state.comments.length < 4 ? 'padding' : 'position'}
          style={[styles.containerWithNavbar, styles.root]}>
          <ScrollView
            ref={this._setRef}
            onContentSizeChange={this._onContentSizeChange}
            style={styles.list}>
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
          <View style={styles.inputGroupWrapper}>
            <View style={styles.inputWrapper}>
              <TextInput
                autoFocus
                placeholder='Add a comment'
                style={styles.input}
                value={this.state.text}
                autoCapitalize='none'
                onSubmitEditing={this.handleSend}
                onChangeText={this._setText}
                autoCorrect={false}
              />
            </View>
            <RoundedButton style={styles.inputButton}
              onPress={this.handleSend}
            >
              Send
            </RoundedButton>
          </View>
        </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    accessToken: _.find(state.session.tokens, {type: 'access'})
  }
}

const mapDispatchToProps = () => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCommentsScreen)
