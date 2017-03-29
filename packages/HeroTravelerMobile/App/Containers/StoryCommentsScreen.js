import React, { PropTypes } from 'react'
import { Text, View, ScrollView, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Colors, Metrics } from '../Themes/'
import SearchBar from '../Components/SearchBar'
import moment from 'moment'

import styles from './Styles/StoryCommentsScreenStyles'


const Comment = ({avatar, name, comment, timestamp}) => {
  return (
    <View style={styles.commentWrapper}>
      <View style={styles.comment}>
        <Image style={styles.avatar} source={{uri: avatar }}></Image>
        <View style={styles.commentTextWrapper}>
          <Text style={styles.commentName}>{name}</Text>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  )
}

const List = ({children}) => {
  return (
    <ScrollView style={styles.list}>
      {children}
    </ScrollView>
  )
}

const formatDate = function(stamp){
  var calendar = moment(stamp).calendar().split(' ')[0];
  return (calendar === 'Today')
    ? calendar
    : (calendar === 'Yesterday')
      ? '1 day ago'
      : moment(stamp).format('MMM DD');
}

class StoryCommentsScreen extends React.Component {
  constructor(props) {    
    super(props);
 
    this.state = {
      comment: '',
      name: 'Heronymous Travelerski',
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/solid_color/128.jpg',
      comments: [],
    };
    this.handleSend = this.handleSend.bind(this);
  }

  handleSend(){
    const newComment = {};
    newComment.user = {};
    newComment.user.profile = {};
    newComment.user.profile.fullName = this.state.name;
    newComment.user.profile.avatar = this.state.avatar;
    newComment.createdAt = Date.now();
    newComment.comment = this.state.comment;
    const newCommentArray = this.state.comments.slice(0);
    newCommentArray.push(newComment)
    this.setState({
      comments: newCommentArray,
      comment: '',
    });
  }

  render () {

    return (
        <KeyboardAvoidingView behavior='position' style={[styles.containerWithNavbar, styles.root]}>
          <List>
          {this.state.comments.map(comment => {
            return(
              <Comment
                avatar={comment.user.profile.avatar}
                name={comment.user.profile.fullName}
                comment={comment.comment}
                timestamp={formatDate(comment.createdAt)}
                key={comment.createdAt.toString()}
              />
              )})}          
          </List>
          <View style={styles.inputGroupWrapper}>
            <View style={styles.inputWrapper}>
                <TextInput
                autoFocus
                placeholder='Add a comment'
                style={styles.input}
                value={this.state.comment}
                autoCapitalize='none'
                onSubmitEditing={this.handleSend}
                onChangeText={(text) => this.setState({comment: text})}
                autoCorrect={false}
                />
            </View>
            <RoundedButton style={styles.inputButton} onPress={this.handleSend}>Send</RoundedButton>
          </View>
        </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCommentsScreen)
