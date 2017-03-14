import React, { PropTypes } from 'react'
import { ScrollView, Text } from 'react-native'

// Styles
import styles from './Styles/MyFeedScreenStyles'

import StoryList from '../Components/StoryList.js'

export default class MyFeedScreen extends React.Component {
  static propTypes = {
    stories: PropTypes.array
  };

  static defaultProps = {
    stories: [{
      title: "Story 1",
      description: "Test Story 1",
      author:{
        fullName: "Joe Test"
      },
      likes: 10,
      createdAt: Date.now(),
      coverImage: "http://www.discover-bali-indonesia.com/photos/bali-rice-fields-02.jpg"
    },
      {
        title: "My Longer Story Title 2",
        description: "Testing the longer titles is probably something that we should be doing anyway",
        author: {
          fullName: "Joe Test"
        },
        likes: 0,
        createdAt: Date.now(),
        coverImage: "https://pix6.agoda.net/city/17193/17193-7x3.jpg"
      }]
  };

  componentDidMount(){
  //  dispatch action to get stories
  }

  render () {

    let loaded = true;


    if (loaded){

      let { stories } = this.props;

      if (stories.length){
        return (
          <ScrollView style={styles.containerWithNavbar}>
            <StoryList stories={stories}/>
          </ScrollView>
        )
      } else {
        return (
          <ScrollView style={styles.containerWithNavbar}>
            <Text style={styles.title}>There are no stories here</Text>
          </ScrollView>
        )
      }
    } else {
      alert("stories loading")
    }
  }
}

//
// const mapStateToProps = (state) => {
//   return {
//     stories: isLoggedIn(state.login)
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     goToMyFeed: () => {
//       return NavigationActions.tabbar()
//     },
//     attemptFacebookLogin: () => {
//       return dispatch(LoginActions.loginFacebook())
//     }
//   }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
