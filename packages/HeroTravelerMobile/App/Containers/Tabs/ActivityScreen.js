import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
// Styles
import styles from '../Styles/NotificationScreenStyles'


const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default class NotificationScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = { selectedTab: 0 }
  }

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.user._id)
  }

  _showLoader(){
   return (
     <Text style={styles.message}>Loading</Text>
   )
  }

  _showError(){
    return (
      <Text style={styles.message}>Error</Text>
    )
  }

  _showNoActivity(){
    return (
      <Text style={styles.title}>There is no activity here</Text>
    )

  _showNoInbox(){
    return (
      <Text style={styles.title}>Inbox Empty!</Text>
    )
  }
    render () {

      let { users, fetching, error } = this.props
      let content

      if (fetching || error) {
        let innerContent = fetching ? this._showLoader() : this._showError()
        content = this._wrapElt(innerContent);
      }

    return (
      <ScrollView style={styles.containerWithNavbar}>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            <Tab selected={this.state.selectedTab === 0} onPress={() => this.setState({selectedTab: 0})} text='ACTIVITY' />
            <Tab selected={this.state.selectedTab === 1} onPress={() => this.setState({selectedTab: 1})} text='INBOX' />
        { this.state.selectedTab === 0 ? <ActivityList
          style={styles.activityList}
          activities={activities}
          height={imageHeight}
          onPressActivity={() => alert('Activity navigation function goes here')}
         />: null }


        { this.state.selectedTab === 1 ? <InboxList
          style={styles.inboxList}
          activities={activities}
          height={imageHeight}
          onPressActivity={() => alert('Inbox navigation function goes here')}
        /> : null}

            {!this.props.forProfile && <View style={styles.divider}></View>}
              <View style={styles.detailContainer}>
                {!this.props.forProfile &&
                  <View style={styles.row}>
                    <Image style={styles.avatar} source={{uri: profile.avatar}}></Image>
                    <Text style={styles.username}>{username}</Text>
                  </View>
                }
                {this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.subtitle, this.props.subtitleStyle]}>{description}</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={story.counts.likes}
                      isLiked={story.counts.likes % 2 === 0}
                    />
                  </View>
                }
                {!this.props.forProfile &&
                  <View style={styles.row}>
                    <Text style={[styles.bottomRight, styles.timeSince]}>2 days ago</Text>
                    <LikesComponent
                      onPress={this._onPressLike}
                      numberStyle={styles.bottomRight}
                      likes={42}
                      isLiked={false}
                    />
                  </View>
                }
              </View>
          </View>

        </View>
      </ScrollView>
    )
  }
}


const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    user: state.session.user,
    fetching,
    posts,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: (userId) => {
      return dispatch(StoryActions.feedRequest(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)
