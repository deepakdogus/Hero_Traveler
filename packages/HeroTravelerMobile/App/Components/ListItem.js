import React, {Component, PropTypes} from 'react'
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {Metrics, Colors} from '../Shared/Themes/'

const S = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    padding: Metrics.doubleBaseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlphaPt3
  },
  left: {
    marginRight: Metrics.doubleBaseMargin
  },
  middle: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  secondaryText: {
    marginTop: Metrics.baseMargin / 2
  }
})

export default class ListItem extends Component {

  static propTypes = {
    leftElement: PropTypes.element,
    text: PropTypes.node.isRequired,
    secondaryText: PropTypes.node,
    rightElement: PropTypes.element,
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[S.root, this.props.style]}>
          {this.props.leftElement && <View style={S.left}>{this.props.leftElement}</View>}
          <View style={S.middle}>
            {this.props.text}
            <View style={S.secondaryText}>{this.props.secondaryText}</View>
          </View>
          {this.props.rightElement && <View style={S.right}>{this.props.rightElement}</View>}
        </View>
      </TouchableWithoutFeedback>
    )
  }

}
