import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Metrics.baseMargin*2,
  },
  header: {
    height: 105,
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  searchWrapper: {
    marginTop: Metrics.baseMargin,
    height: 20,
    backgroundColor: '#424242',
    opacity: .6,
    paddingLeft: Metrics.baseMargin/2,
    paddingRight: Metrics.baseMargin/2,
    borderRadius: 5
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.snow,
    textAlign: 'center'
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    color: Colors.snow,
    textAlign: 'center'
  },
  grid: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  gridRow: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
    margin: 2,
    backgroundColor: Colors.transparent
  },
  gridImage: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
  },
  gridRowText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    color: Colors.snow,
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 100
  }
})
