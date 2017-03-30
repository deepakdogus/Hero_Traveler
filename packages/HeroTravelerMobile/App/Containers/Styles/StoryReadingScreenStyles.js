import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  toolBar: {
  	flex: 1,
  	flexDirection: 'row', 
  	height: Metrics.tabBarHeight,
  	width: '100%',
  	borderWidth: 1,
  	borderColor: Colors.navBarText,	
  	backgroundColor: Colors.snow,
  	justifyContent: 'space-around',
  	alignItems: 'center',
  	position: 'absolute',
  	bottom: 0,
  }
})
