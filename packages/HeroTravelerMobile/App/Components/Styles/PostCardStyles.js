import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  container: {
    marginVertical: Metrics.marginVertical,
  },
  contentContainer: {
    position: 'relative',
    marginRight: Metrics.marginLeft / 2,
    alignSelf: 'center',
  },
  firstContentContainer: {
    marginLeft: Metrics.marginLeft,
  },
  lastContentContainer: {
    marginRight: Metrics.marginRight,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingLeft: Metrics.paddingLeft,
    paddingRight: Metrics.paddingRight,
  },
  caption: {
    marginTop: '60%',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#ffffff',
  },
  message: {
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular,
    fontWeight: 'bold',
    color: Colors.steel,
  },
  icon: {
    color: Colors.steel,
  },
})
