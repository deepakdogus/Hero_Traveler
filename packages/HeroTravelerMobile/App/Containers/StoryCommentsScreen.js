import React, { PropTypes } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

import styles from './Styles/StoryReadingScreenStyles'

class StoryCommentsScreen extends React.Component {

  render () {

    return (
      <View style={[styles.containerWithNavbarAndTabbar, styles.root]}>
        <Text>Comment UI goes here</Text>
      </View>
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
