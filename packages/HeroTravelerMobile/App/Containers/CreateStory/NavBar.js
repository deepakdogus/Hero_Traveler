import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import TextButton from '../../Components/TextButton'
import TabIcon from '../../Components/TabIcon'
import {Metrics, Colors, Fonts} from '../../Themes'

const styles = StyleSheet.create({
  root: {
    height: Metrics.navBarHeight,
    paddingTop: Metrics.baseMargin,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.navBarText,
  },
  title: {
    flex: 1/3,
  },
  titleText: {
    textAlign: 'center'
  },
  left: {
    flex: 1/3,
  },
  leftText: {
    textAlign: 'left',
    paddingLeft: Metrics.doubleBaseMargin
  },
  right: {
    flex: 1/3,
  },
  rightText: {
    textAlign: 'right',
    paddingRight: Metrics.doubleBaseMargin
  }
})

export default class NavBar extends Component {

  render() {
    return (
      <View style={styles.root}>
        {this.props.leftIcon && <TabIcon style={this.props.leftIconStyle} name={this.props.leftIcon}/>}
        {this.props.leftTitle &&
          <View style={styles.left}>
            <TextButton
              style={[styles.text, styles.leftText, this.props.leftTextStyle]}
              onPress={this.props.onLeft}
            >
              {this.props.leftTitle}
            </TextButton>
          </View>
        }
        {this.props.title &&
          <View style={styles.title}>
            <Text style={[styles.text, styles.titleText]}>{this.props.title}</Text>
          </View>
        }
        {this.props.rightTitle &&
          <View style={styles.right}>
            <TextButton
              style={[styles.text, styles.rightText, this.props.rightTextStyle]}
              onPress={this.props.onRight}
            >
              {this.props.rightTitle}
            </TextButton>
          </View>
        }
        {this.props.rightIcon && <TabIcon style={this.props.rightIconStyle} name={this.props.rightIcon}/>}
      </View>
    )
  }
}
