import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar
  },
  newContentButton: {
    padding: 10
  },
  createMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  createMenuButton: {
    padding: 10,
    margin: 10
  },
  addContentWrapper: {
    position: 'absolute',
    bottom: 0
  }
})
