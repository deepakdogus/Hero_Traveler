import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Colors } from '../Shared/Themes'
import Tab from './Tab'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.feedDividerGrey,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBarText,
  },
  scrollView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})

export default class TabBar extends Component {
  static propTypes = {
    tabs: PropTypes.object.isRequired,
    activeTab: PropTypes.string, // removing required since it can also be null
    onClickTab: PropTypes.func.isRequired,
    tabStyle: PropTypes.number, // StyleSheet.create returns numbers
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
          selected={activeTab===tabs[key]}
          onPress={this._onCickTab(tabs[key])}
        />
      )
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
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
