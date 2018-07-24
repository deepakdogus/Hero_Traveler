import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Shared/Themes/'

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
  dropdownMarker: {
    borderTopWidth: 5,
    borderTopColor: 'black',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    height: 10,
    width: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  modalCloseButton: {
    backgroundColor: Colors.redHighlights,
    padding: 10,
  },
  modalCloseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.type.sourceSansPro,
    textAlign: 'center',
  }
})

export default formInputStyles
