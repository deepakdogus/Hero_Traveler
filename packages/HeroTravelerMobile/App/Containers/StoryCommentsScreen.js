import React, { PropTypes } from 'react'
import { Text, View, ScrollView, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Colors, Metrics } from '../Themes/'
import SearchBar from '../Components/SearchBar'

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
  var duration = Date.now() - stamp;

  if(duration < 86400000){
    return 'Today';
  } else if (duration < 172800000) {
    return '1 day ago';
  } else {
    var newMonth = new Date(stamp).getMonth(),
    newDate = new Date(stamp).getDate().toString(),
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[newMonth] + ' ' + newDate;
  }
}

class StoryCommentsScreen extends React.Component {

  static defaultProps = { 
    comments: [{
      comment: "This is my comment",
      createdAt: 1490710993,
      user: {
        profile: {
          fullName: "Vladimir Putin",
          avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/solid_color/128.jpg"
        }
      }
    }, {
      comment: "This is another comment",
      createdAt: 1490709965,
      user: {
        profile: {
          fullName: "Andy Watt",
          avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/solid_color/128.jpg"
        }
      }
    }, {
      comment: "This is another goshdarned comment",
      createdAt: 1483228800000,
      user: {
        profile: {
          fullName: "Jasper Johns",
          avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/solid_color/128.jpg"
        }
      }
    }, {
      comment: "This is another goshdarned comment, Robin",
      createdAt: 1490731854179,
      user: {
        profile: {
          fullName: "The Batman",
          avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/solid_color/128.jpg"
        }
      }
    }]
  }

  static propTypes = {
    comments: PropTypes.array,
  }  

  render () {

    return (
        <KeyboardAvoidingView behavior='position' style={[styles.containerWithNavbar, styles.root]}>
          <List>
          {this.props.comments.map(comment => {
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
                autoCapitalize='none'
                autoCorrect={false}
                />
            </View>
            <RoundedButton style={styles.inputButton}>Send</RoundedButton>
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
