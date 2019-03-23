import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class FullScreenButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
  }

  render () {
    return (
      <View style={styles.button}>
        <TouchableOpacity
          onPress={this.props.onPress}
        >
          <Icon
            name='expand'
            color='white'
            style={styles.icon}
            size={20} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10000,
  },
  icon: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,.75)'
  }
})
