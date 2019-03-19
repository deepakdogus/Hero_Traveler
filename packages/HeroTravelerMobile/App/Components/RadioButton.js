import React from 'react'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../Shared/Themes'
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native'

const RadioButton = ({ text, onPress, selected, whiteText }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.radio}>
        <View
          style={[
            styles.radioBtnOuter,
            selected ? styles.radioBtnActiveBorder : {},
          ]}
        >
          <View
            style={[
              styles.radioBtnInner,
              selected ? styles.radioBtnActiveBackground : {},
            ]}
          />
        </View>
        <Text style={[styles.radioText, whiteText ? styles.whiteText : {}]}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

RadioButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  whiteText: PropTypes.bool,
}

const styles = StyleSheet.create({
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Metrics.baseMargin,
  },
  radioBtnOuter: {
    borderRadius: 100,
    width: 15,
    height: 15,
    backgroundColor: Colors.snow,
    borderWidth: 1.5,
    borderColor: Colors.navBarText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtnInner: {
    borderRadius: 100,
    width: 7,
    height: 7,
    backgroundColor: Colors.snow,
  },
  radioBtnActiveBorder: {
    borderColor: Colors.redHighlights,
  },
  radioBtnActiveBackground: {
    backgroundColor: Colors.redHighlights,
  },
  radioText: {
    marginLeft: Metrics.baseMargin,
    fontWeight: '500',
    fontSize: 16,
  },
  whiteText: {
    color: Colors.snow,
  },
})

export default RadioButton
