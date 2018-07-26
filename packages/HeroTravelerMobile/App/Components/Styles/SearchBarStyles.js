import {StyleSheet} from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    width: '100%',
    height: 50,
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    marginBottom: Metrics.baseMargin,
  },
  searchInput: {
    padding: Metrics.smallMargin,
    textAlign: 'left',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.snow,
    paddingLeft: 30,
    flexDirection: 'row',
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
  searchIcon: {
    color: Colors.grey,
    position: 'absolute',
    left: 2,
    alignSelf: 'center',
    backgroundColor: Colors.transparent
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Metrics.baseMargin,
    marginTop: 5,
  },
  buttonLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular
  },
})
