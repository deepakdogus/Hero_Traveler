import { StyleSheet } from 'react-native'
import { Fonts, Images, Colors, Metrics } from '../../Shared/Themes'

const styles = StyleSheet.create({
  multilineContainer: {
    marginBottom: Metrics.doubleBaseMargin,
  },
  multilineLabel: {
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: Metrics.baseMargin,
  },
  multilineTextInput: {
    borderWidth: 1,
    borderColor: Colors.navBarText,
    padding: Metrics.baseMargin,
    flex: 1,
    color: Colors.background,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 90,
  },
  checkboxContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  checkboxMark: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    marginRight: Metrics.baseMargin,
  },
  checkboxLabel: {
    fontFamily: Fonts.type.bold,
    fontWeight: '600',
    fontSize: 16,
  },
  form: {
    padding: Metrics.doubleBaseMargin,
    paddingTop: 2 * Metrics.doubleBaseMargin,
  }
})

export default styles
