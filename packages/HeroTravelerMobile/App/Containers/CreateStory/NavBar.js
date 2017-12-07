import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

import TextButton from '../../Components/TextButton'
import TabIcon from '../../Components/TabIcon'
import {Metrics, Colors, Fonts} from '../../Shared/Themes'
import NavButtonStyles from '../../Navigation/Styles/NavButtonStyles'

const styles = StyleSheet.create({
  root: {
    height: Metrics.navBarHeight,
    paddingTop: Metrics.baseMargin,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.red,
  },
  title: {
    flex: 1/3,
  },
  titleText: {
    textAlign: 'center',
    color: Colors.white,
  },
  row: {
    flexDirection: 'row'
  },
  left: {
    flex: 1/3,
    flexDirection: 'row',
  },
  leftText: {
    textAlign: 'left',
    paddingLeft: Metrics.doubleBaseMargin,
    color: Colors.white,
  },
  right: {
    flex: 1/3,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  rightText: {
    textAlign: 'right',
    paddingRight: Metrics.doubleBaseMargin,
  },
  leftBtn: {
    tintColor: Colors.white
  },
  inactiveText: {
    opacity: .5,
    color: Colors.navBarText,
  },
  inactiveBtn: {
    opacity: .2,
    tintColor: Colors.navBarText,
  },
  leftIconStyle: {
    ...NavButtonStyles.image,
    marginLeft: 10,
  },
  rightIconStyle: {
    ...NavButtonStyles.image,
    marginRight: 10,
  },
})

export default class NavBar extends Component {

  render() {
    const { style,
        leftTitle, leftIcon, leftTextStyle, leftIconStyle, onLeft,
        title, titleStyle, onTitle,
        rightTitle, rightIcon, rightTextStyle, onRight, isRightValid = true } = this.props
    return (
      <View style={[styles.root, style]}>
        {(leftTitle || leftIcon) &&
          <View style={styles.left}>
            <TouchableOpacity onPress={onLeft} style={styles.row}>
              {leftIcon &&
                <TabIcon
                  style={{ image: [styles.leftIconStyle, styles.leftBtn, leftIconStyle] }}
                  name={leftIcon}/>
              }
              {leftTitle &&
                <Text style={[styles.text, styles.leftText, leftTextStyle]}>
                  {leftTitle
                }</Text>}
            </TouchableOpacity>
          </View>
        }

        {title &&
          <View style={styles.title}>
            {!onTitle && <Text style={[styles.text, styles.titleText, titleStyle || {}]}>{title}</Text>}
            {onTitle && <TextButton
              style={[styles.text, styles.titleText, titleStyle || {}, isRightValid ? {} : styles.inactiveText]}
              onPress={onTitle}
            >
              {title}
            </TextButton>}
          </View>
        }

        {rightTitle &&
          <View style={styles.right}>
            <TouchableOpacity onPress={onRight} style={styles.row}>
              <Text style={[styles.text, styles.rightText, rightTextStyle, isRightValid ? {} : styles.inactiveText]}>
                {rightTitle}
              </Text>
              {rightIcon && rightIcon !== 'none' &&
                <TabIcon
                  style={{image: [styles.rightIconStyle, isRightValid ? {} : styles.inactiveBtn]}}
                  name={rightIcon}
                />
              }
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
}
