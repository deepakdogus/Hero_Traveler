import React from 'react'
import { ScrollView, View } from 'react-native'
import { Colors } from '../Shared/Themes'

const styles = {
  alignItems: 'center',
  backgroundColor: Colors.feedDividerGrey,
  height: 50,
  borderBottomWidth: 1,
  borderBottomColor: Colors.navBarText,
}

const Tabs = ({ children }) => (
  <View style={styles}>
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyles={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
      bounces={false}>
      {children}
    </ScrollView>
  </View>
)

export default Tabs
