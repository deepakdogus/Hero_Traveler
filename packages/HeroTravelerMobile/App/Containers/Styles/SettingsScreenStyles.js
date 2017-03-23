import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.lightGreyAreas
  },
  separator: {
    height: 35,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: Colors.navBarText,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBarText,
    backgroundColor: Colors.snow
  },
  row: {
    padding: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowText: {
    fontSize: 15,
    color: '#757575',
    fontWeight: '300',
    flexGrow: 2,
    marginLeft: Metrics.baseMargin
  },
  isConnectedText: {
    color: Colors.red,
    marginRight: Metrics.baseMargin
  }
})
