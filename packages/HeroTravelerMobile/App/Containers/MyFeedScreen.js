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
