import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {Metrics, Colors} from '../Shared/Themes/'

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: Metrics.doubleBaseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
    alignItems: 'center',
  },
  left: {
    marginRight: Metrics.doubleBaseMargin,
  },
  middle: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 3,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  secondaryText: {
    marginTop: Metrics.baseMargin / 2,
  },
})

export default class ListItem extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    leftElement: PropTypes.element,
    text: PropTypes.node.isRequired,
    secondaryText: PropTypes.node,
    rightElement: PropTypes.element,
  }

  render() {
    const {
      onPress,
      style,
      text,
      leftElement,
      secondaryText,
      rightElement,
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.root, style]}>
          {leftElement && <View style={styles.left}>{leftElement}</View>}
          <View style={styles.middle}>
            {text}
            <View style={styles.secondaryText}>{secondaryText}</View>
          </View>
          {rightElement && <View style={styles.right}>{rightElement}</View>}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
