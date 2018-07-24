import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, } from '../../Shared/Themes'

export default StyleSheet.create({
  list: {
    paddingHorizontal: Metrics.baseMargin,
  },
  searchBarIcon: {
    color: Colors.grey,
    position: 'absolute',
    left: 2,
  },
  searchBarInput: {
    color: Colors.background,
    fontSize: 15,
    letterSpacing: 0.7,
    fontWeight: '400',
    width: '100%',
    height: '100%',
    flex: 1,
    alignSelf: 'flex-start',
    fontFamily: Fonts.type.sourceSansPro,
  },
  searchBar: {
    flex: 1,
    marginTop: 0,
    width: '100%',
    height: 50,
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    marginBottom: Metrics.baseMargin,
  },
  coverHeight: {
    height: 415,
  },
  fieldWrapper: {
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
    marginVertical: Metrics.baseMargin,
    flexDirection: 'row',
  },
  inputStyle: {
    flex: 1,
    color: Colors.background,
    fontSize: 16,
    marginBottom: 10,
    height: 30,
  },
  loaderStyles: {
    position: 'absolute',
    zIndex: 2,
    top: Metrics.navBarHeight - Metrics.baseMargin,
    right: 0,
    bottom: 0,
    left: 0,
  },
  errorButton: {
    zIndex: 10,
  },
  tooltipContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
    bottom: 55,
  },
  tooltipTip: {
    left: 20,
  }
})
