import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import {Fonts, Colors, Metrics} from '../Shared/Themes'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 18,
    fontFamily: Fonts.type.montserrat,
    marginTop: Metrics.baseMargin
  }
})


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
        {this.props.text &&
          <Text
            style={[
              styles.textStyle,
              this.props.textStyle
            ]}
          >
            {this.props.text}
          </Text>
        }
      </View>
    )
  }
}
