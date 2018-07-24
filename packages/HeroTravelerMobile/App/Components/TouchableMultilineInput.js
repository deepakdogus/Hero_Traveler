import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableOpacity } from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import detailsStyles from '../Containers/CreateStory/4_CreateStoryDetailScreenStyles'

class TouchableMultilineInput extends React.Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
  }

  onPress = () => {
    const {onDone, value, placeholder, title} = this.props
    NavActions.textInputScreen({
      onDone,
      text: value,
      title,
      placeholder,
    })
  }

  render() {
    const {label, value, placeholder} = this.props
    return (
      <View style={detailsStyles.travelTipsWrapper}>
        <Text style={detailsStyles.fieldLabel}>{label}</Text>
        <View style={detailsStyles.travelTipsPreview}>
          <TouchableOpacity onPress={this.onPress}>
            <Text style={[
              detailsStyles.travelTipsPreviewText,
              value ? {} : detailsStyles.travelTipsPreviewTextDimmed
            ]}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default TouchableMultilineInput
