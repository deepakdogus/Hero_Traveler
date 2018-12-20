import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from '../Containers/Styles/ExploreScreenStyles'

const Tab = ({text, onPress, selected}) => {
  const containerStyle = [styles.tab, selected ? styles.tabSelected : null]
  const textStyle = [styles.tabText, selected ? styles.tabTextSelected : null]
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  )
}

Tab.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
}

class SearchTabBar extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number,
    goToPlacesTab: PropTypes.func,
    goToPeopleTab: PropTypes.func,
  }

  render = () => (
    <View style={styles.tabnav}>
      <Tab
        selected={this.props.selectedTabIndex === 0}
        onPress={this.props.goToPlacesTab}
        text='PLACES'
      />
      <Tab
        selected={this.props.selectedTabIndex === 1}
        onPress={this.props.goToPeopleTab}
        text='PEOPLE'
      />
    </View>
  )
}

export default SearchTabBar
