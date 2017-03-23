import { StyleSheet } from 'react-native'
import {
  ApplicationStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../Shared/Themes'

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
  }
})
