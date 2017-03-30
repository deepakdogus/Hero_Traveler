import React, { Component, PropTypes } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import {Colors} from '../Themes'
import styles from './Styles/LoaderStyles'

export default class Loader extends Component {
  static propTypes = {
    useNavBarMargin: PropTypes.bool,
    useTabBarMargin: PropTypes.bool,
    // style
    spinnerColor: PropTypes.string,
    tintColor: PropTypes.string,
    text: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large']),
  }

  static defaultProps = {
    useNavBarMargin: false,
    useTabBarMargin: false,
    spinnerColor: Colors.lightGreyAreas,
    tintColor: Colors.transparent,
    size: 'large',
  }

  render () {
    return (
      <View style={[
        styles.root,
        {backgroundColor: this.props.tintColor},
        this.props.style
      ]}>
        <ActivityIndicator
          animating={true}
          color={this.props.spinnerColor}
          size={this.props.size}
        />
      </View>
    )
  }
}
