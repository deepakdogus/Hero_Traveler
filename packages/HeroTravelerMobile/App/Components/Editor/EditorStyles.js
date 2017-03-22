import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  root: {
    position: 'relative'
  },
  contentWrapper: {
    minHeight: 30,
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    paddingBottom: 38
  },
  toolbar: {
    flexDirection: 'row',
    height: 38,
    backgroundColor: Colors.snow,
    borderTopColor: Colors.lightGreyAreas,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  createMenuButton: {
    margin: 0,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRightColor: Colors.lightGreyAreas,
    borderRightWidth: 1,
  },
  baseImage: {
    height: 150,
    width: '100%'
  },
  baseText: {
    fontWeight: '300',
    color: '#757575',
  },
  textInput: {
    flex: 1,
    minHeight: 30
  }
})
