import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics } from '../Shared/Themes/'

export default class SelectedItem extends React.Component {
  static propTypes = {
    onPressRemove: PropTypes.func,
    text: PropTypes.string,
    item: PropTypes.object,
  }

  _onPressRemove = () => {
    this.props.onPressRemove(this.props.item)
  }

  render () {
    const {text} = this.props
    return (
      <View style={styles.selectedTagRow}>
        <TouchableOpacity onPress={this._onPressRemove} style={styles.row}>
          <Text>{text}</Text>
          <Icon name='close' size={15} style={styles.removeTagIcon} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectedTagRow: {
    backgroundColor: Colors.lightGreyAreas,
    marginBottom: Metrics.baseMargin / 5,
  },
  row: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  removeTagIcon: {
    marginTop: 2,
    color: Colors.background
  },
})
