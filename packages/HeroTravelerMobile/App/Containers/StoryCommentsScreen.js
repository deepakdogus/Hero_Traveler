import React, { PropTypes } from 'react'
import { Text, View, ScrollView, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Colors, Metrics } from '../Themes/'
import SearchBar from '../Components/SearchBar'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from './Styles/StoryCommentsScreenStyles'


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
    super(props);

    this.state = {
      text: '',
      comments: []
    }
  }

  handleSend = () => {
    const newComment = {
      user: this.props.user,
      createdAt: Date.now(),
      comment: this.state.text
    };
    this.setState({
      comments: [
        ...this.state.comments,
        newComment
      ],
      text: '',
    });
  }

  render () {

    return (
        <KeyboardAvoidingView behavior='position' style={[styles.containerWithNavbar, styles.root]}>
          <ScrollView style={styles.list}>
          {this.state.comments.map(comment => {
            return(
              <Comment
                avatar={comment.user.profile.avatar}
                name={comment.user.profile.fullName}
                comment={comment.comment}
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
                onChangeText={(text) => this.setState({text: text})}
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
    user: state.session.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCommentsScreen)
