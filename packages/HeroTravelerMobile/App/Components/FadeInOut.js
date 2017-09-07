'use strict';
import React, {PropTypes, Component} from 'react'
import {View, Animated,} from 'react-native';

export default class FadeInOut extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    style: View.propTypes.style
  }

  constructor(props) {
    super(props)
    this.state = {
      opacity: new Animated.Value(this.props.isVisible ? 1 : 0)
    }
  }

  componentWillReceiveProps(nextProps) {
    const isVisible = this.props.isVisible;
    const shouldBeVisible = nextProps.isVisible;

    if (isVisible && !shouldBeVisible) {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 200
      }).start()
    }

    if (!isVisible && shouldBeVisible) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 200
      }).start()
    }
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.isVisible ? 'auto' : 'none'}
        style={[this.props.style, {opacity: this.state.opacity}]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
