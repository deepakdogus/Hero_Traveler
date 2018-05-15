import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Shared/Themes/'

const formInputStyles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
    marginVertical: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: Colors.background,
    fontSize: 16,
    height: 50,
    lineHeight: 50,
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 20,
    resizeMode: 'contain',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default formInputStyles
