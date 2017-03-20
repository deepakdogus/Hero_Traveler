import React from 'react'
import { ScrollView, Text, Animated } from 'react-native'

// Styles
import styles from '../Styles/MyFeedScreenStyles'

export default class MyFeedScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bounceValue: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.state.bounceValue.setValue(1.5)
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 0.8,
        friction: 0.1
      }
    ).start()
  }

  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Explore</Text>
        <Animated.Text
          style={{
            flex: 1,
            height: 100,
            transform: [
              {scale: this.state.bounceValue}
            ]
          }}
        >
          hello!
        </Animated.Text>
      </ScrollView>
    )
  }
}
