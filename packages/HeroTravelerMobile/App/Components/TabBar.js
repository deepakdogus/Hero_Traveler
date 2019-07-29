import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Colors } from '../Shared/Themes'
import { Metrics } from '../Shared/Themes'
import Tab from './Tab'

const styles = StyleSheet.create({
  containerTwo: {
    width: `${Metrics.feedMargin}%`,
    marginTop: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerFourSmall: {
    width: `${Metrics.feedMargin}%`,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerFourLarge: {
    width: `${Metrics.feedMargin}%`,
    marginTop: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.snow,
    height: 40,

    borderBottomColor: Colors.feedDividerGrey,
  },
  largeWrapper: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default class TabBar extends Component {
  static propTypes = {
    tabs: PropTypes.object.isRequired,
    activeTab: PropTypes.string, // removing required since it can also be null
    onClickTab: PropTypes.func.isRequired,
    tabStyle: PropTypes.number, // StyleSheet.create returns numbers
    largeTabBar: PropTypes.bool,
  }

  onClickTab = tabValue => () => this.props.onClickTab(tabValue)

  renderTabs() {
    const { activeTab, tabs, tabStyle } = this.props
    return Object.keys(tabs).map((key, index) => (
      <Tab
        key={index}
        style={tabStyle}
        text={tabs[key].toUpperCase()}
        selected={activeTab === tabs[key]}
        onPress={this.onClickTab(tabs[key])}
      />
    ))
  }

  tabBarRender = (tabAmount, largeTabBar) => {
    const sizeStyle = largeTabBar
      ? styles.containerFourLarge
      : styles.containerFourSmall
    switch (tabAmount){
      case 2:
        return (
          <View style={styles.containerTwo}>
            {this.renderTabs()}
          </View>
        )
      case 4:
        return (
          <View style={sizeStyle}>
            {this.renderTabs()}
          </View>
        )
      default:
        return (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyles={styles.scrollView}
            bounces={false}
          >
            {this.renderTabs()}
          </ScrollView>
        )
    }
  }

  render() {
    const { largeTabBar, tabs } = this.props
    const tabAmount = Object.keys(tabs).length
    return (
      <View style={[styles.wrapper, largeTabBar && styles.largeWrapper]}>
        {this.tabBarRender(tabAmount, largeTabBar)}
      </View>
    )
  }
}
