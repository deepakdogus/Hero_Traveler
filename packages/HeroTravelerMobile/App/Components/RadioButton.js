import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../Shared/Themes'
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native'

class RadioButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    value: PropTypes.string,
    lightText: PropTypes.bool,
  }

  handlePress = () => this.props.onPress(this.props.value)

  render() {
    const { text, selected, lightText } = this.props
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
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
          <Text style={[styles.radioText, lightText ? styles.lightText : {}]}>
            {text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
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
  lightText: {
    color: Colors.grey,
  },
})

export default RadioButton
