import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import TextButton from '../../Components/TextButton'
import TabIcon from '../../Components/TabIcon'
import { Metrics, Colors, Fonts } from '../../Shared/Themes'
import NavButtonStyles from '../../Navigation/Styles/NavButtonStyles'
import { isIPhoneX } from '../../Themes/Metrics'

const styles = StyleSheet.create({
  root: {
    height: 80, // 80 nav height + 40 tab height = 120 total height
    backgroundColor: Colors.snow,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isIPhoneX() ? 20 : 15,
  },
  text: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 8 / 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isIPhoneX() ? 15 : 0,
  },
  titleText: {
    textAlign: 'center',
    color: Colors.background,
    fontSize: 13,
    justifyContent: 'center',
  },
  left: {
    flex: 3 / 10,
    flexDirection: 'row',
    marginTop: isIPhoneX() ? 15 : 0,
  },
  leftText: {
    textAlign: 'left',
    paddingLeft: Metrics.doubleBaseMargin,
    color: Colors.background,
  },
  right: {
    flex: 3 / 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: isIPhoneX() ? 15 : 0,
  },
  rightText: {
    textAlign: 'right',
    paddingRight: Metrics.doubleBaseMargin,
    color: Colors.redHighlights,
  },
  leftBtn: {
    tintColor: Colors.navBarText,
  },
  inactiveText: {
    opacity: 0.5,
    color: Colors.navBarText,
  },
  inactiveBtn: {
    opacity: 0.2,
    tintColor: Colors.navBarText,
  },
  leftIconStyle: {
    ...NavButtonStyles.image,
    tintColor: Colors.red,
    marginLeft: 10,
  },
  extraTouchMarginStyle: {
    marginRight: 50,
  },
  rightIconStyle: {
    ...NavButtonStyles.image,
    marginRight: 10,
  },
})

export default class NavBar extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    leftTitle: PropTypes.string,
    leftIcon: PropTypes.string,
    leftTextStyle: PropTypes.number,
    leftIconStyle: PropTypes.number,
    onLeft: PropTypes.func,
    title: PropTypes.string,
    titleStyle: PropTypes.number,
    onTitle: PropTypes.func,
    rightTitle: PropTypes.string,
    rightIcon: PropTypes.string,
    rightTextStyle: PropTypes.number,
    onRight: PropTypes.func,
    isRightValid: PropTypes.bool,
  }

  render() {
    const {
      style,
      leftTitle,
      leftIcon,
      leftTextStyle,
      leftIconStyle,
      onLeft,
      title,
      titleStyle,
      onTitle,
      rightTitle,
      rightIcon,
      rightTextStyle,
      onRight,
      isRightValid = true,
    } = this.props
    return (
      <View style={[styles.root, style]}>
        {(leftTitle || leftIcon) && (
          <View style={styles.left}>
            <TouchableOpacity onPress={onLeft} style={styles.row}>
              {leftIcon && (
                <TabIcon
                  style={{
                    image: [
                      styles.leftIconStyle,
                      styles.leftBtn,
                      !leftTitle && styles.extraTouchMarginStyle,
                      leftIconStyle,
                    ],
                  }}
                  name={leftIcon}
                />
              )}
              {leftTitle && (
                <Text style={[styles.text, styles.leftText, leftTextStyle]}>
                  {leftTitle}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {title && (
          <View style={styles.title}>
            {!onTitle && (
              <Text style={[styles.text, styles.titleText, titleStyle || {}]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {onTitle && (
              <TextButton
                style={[
                  styles.text,
                  styles.titleText,
                  titleStyle || {},
                  isRightValid ? {} : styles.inactiveText,
                ]}
                onPress={onTitle}
              >
                {title}
              </TextButton>
            )}
          </View>
        )}

        {rightTitle && (
          <View style={styles.right}>
            <TouchableOpacity onPress={onRight} style={styles.row}>
              <Text
                style={[
                  styles.text,
                  styles.rightText,
                  rightTextStyle,
                  isRightValid ? {} : styles.inactiveText,
                ]}
              >
                {rightTitle}
              </Text>
              {rightIcon && rightIcon !== 'none' && (
                <TabIcon
                  style={{
                    image: [
                      styles.rightIconStyle,
                      isRightValid ? {} : styles.inactiveBtn,
                    ],
                  }}
                  name={rightIcon}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}
