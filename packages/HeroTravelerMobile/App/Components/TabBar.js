import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Colors } from '../Shared/Themes'
import Tab from './Tab'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.snow,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
  },
  largeWrapper: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  scrollView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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

  _onCickTab = (tabValue) => {
    return () => this.props.onClickTab(tabValue)
  }

  renderTabs(){
    const {activeTab, tabs, tabStyle} = this.props
    return Object.keys(tabs).map((key, index) => {
      return (
        <Tab
          key={index}
          style={tabStyle}
          text={key.toUpperCase()}
          selected={activeTab === tabs[key]}
          onPress={this._onCickTab(tabs[key])}
        />
      )
    })
  }

  render() {
    const { largeTabBar } = this.props
    return (
      <View style={[styles.wrapper, largeTabBar && styles.largeWrapper]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyles={styles.scrollView}
          bounces={false}
        >
          {this.renderTabs()}
        </ScrollView>
      </View>

    )
  }
}
