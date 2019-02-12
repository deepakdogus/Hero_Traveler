import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Shared/Themes/'
import { feedItemWidth } from './FeedItemsOfTypeStyles'

export default StyleSheet.create({
  mapView: {
    height: 400,
  },
  calloutView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 10,
    letterSpacing: .7,
    fontWeight: '600',
    marginLeft: 10,
  },
  image: {
    height: feedItemWidth / 2 / 16 * 9,
    width: feedItemWidth / 2,
  },
})
