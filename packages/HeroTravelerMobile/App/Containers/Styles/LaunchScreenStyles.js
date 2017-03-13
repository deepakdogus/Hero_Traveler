import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: 100,
    width: 300,
    resizeMode: 'contain'
  },
  tagline: {
    ...Fonts.style.h5,
    color: Colors.snow
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instructions: {
    ...Fonts.style.instructions,
    textAlign: 'center'
  },
  twitter: {
    marginTop: 0,
    backgroundColor: Colors.twitterBlue
  },
  email: {
    backgroundColor: Colors.red
  },
  facebook: {
    margin: 0,
    backgroundColor: Colors.facebookBlue
  },
  login: {
    backgroundColor: 'green'
  }
})
