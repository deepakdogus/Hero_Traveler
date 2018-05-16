import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import TabIcon from './TabIcon'
import { Colors, Metrics } from '../Shared/Themes'
import detailsStyles from '../Containers/CreateStory/4_CreateStoryDetailScreenStyles'


const commonIconStyle = {
  marginRight: Metrics.doubleBaseMargin,
  marginBottom: Metrics.baseMargin,
}

const iconSizes = {
  location: {
    width: 17,
    height: 27,
    marginLeft: 2.5,
    marginRight: Metrics.doubleBaseMargin - 2.5
  },
  date: { width: 22, height: 22, },
  tag: { width: 22, height: 22, },
  hashtag: { width: 22, height: 24, marginTop: -2},
  cost: { width: 22, height: 24, marginTop: -3},
  info: { width: 22, height: 22},
  gear: { width: 22, height: 22},
}

let iconStyles = {};

for (let s in iconSizes) {
  iconStyles[s] = {
    // This is to ensure the input fields align correctly
    view: { width: Metrics.icons.large },
    image: Object.assign({}, commonIconStyle, iconSizes[s])
  }
}


class FormInput extends Component {
  static defaultProps = {
    keyboardType: 'default',
  }
  static propTypes = {
    onChangeText: PropTypes.func,
    onPress: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    iconName: PropTypes.string,
    keyboardType: PropTypes.string,
    cost: PropTypes.string,
  }

  renderText = () => {
    const {onPress, value, placeholder, keyboardType, cost, onChangeText} = this.props
    if (onPress) {
      return (
        <Text
          style={[detailsStyles.inputStyle, value ? null : { color: Colors.navBarText }]}
        >
          {value || placeholder}
        </Text>
      )
    }
    return (
      <Fragment>
        {!!cost && <Text style={detailsStyles.currency}>$</Text>}
        <TextInput
          style={[detailsStyles.longInputText, value ? null : { color: Colors.navBarText }]}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.navBarText}
          value={value}
          keyboardType={keyboardType}
        />
      </Fragment>
    )
  }

  renderContent = () => {
    const {iconName} = this.props
    return (
      <View style={detailsStyles.fieldWrapper}>
        <TabIcon name={iconName} style={iconStyles[iconName]}/>
        {this.renderText()}
      </View>
    )
  }

  render = () => {
    const { onPress } = this.props

    if (onPress) {
      return (
        <TouchableWithoutFeedback onPress={onPress}>
          {this.renderContent()}
        </TouchableWithoutFeedback>
      )
    }
    return this.renderContent()
  }
}

export default FormInput
