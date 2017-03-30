import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'

// Styles
import styles from '../Styles/NotificationScreenStyles'


const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default class NotificationScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = { selectedTab: 0 }
  }

  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.tabs}>
          <View style={styles.tabnav}>
            <Tab selected={this.state.selectedTab === 0} onPress={() => this.setState({selectedTab: 0})} text='ACTIVITY' />
            <Tab selected={this.state.selectedTab === 1} onPress={() => this.setState({selectedTab: 1})} text='INBOX' />
          </View>
        </View>
      </ScrollView>
    )
  }
}
