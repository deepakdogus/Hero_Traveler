import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Colors } from '../Shared/Themes'
import { Metrics } from '../Shared/Themes'
import Tab from './Tab'

const styles = StyleSheet.create({
  container: {
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

  render() {
    const { largeTabBar, tabs } = this.props
    const ScrollViewRender
      = Object.keys(tabs).length > 4 ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyles={styles.scrollView}
          bounces={false}
        >
          {this.renderTabs()}
        </ScrollView>
      ) : (
        this.renderTabs()
      )
    return (
      <View style={[styles.wrapper, largeTabBar && styles.largeWrapper]}>
        <View style={styles.container}>
          {ScrollViewRender}
        </View>
      </View>
    )
  }
}
