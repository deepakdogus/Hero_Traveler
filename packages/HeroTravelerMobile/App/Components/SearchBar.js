import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './Styles/SearchBarStyles'
import { Colors, Metrics } from '../Shared/Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class SearchBar extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
  }

  static defaultProps = {
    placeholderTextColor: Colors.snow,
    cancelButton: true,
    selectionColor: Colors.snow,
    autoFocus: true,
  }

  render() {
    const {
      autoFocus,
      onSearch,
      onCancel,
      searchTerm,
      containerStyles,
      cancelButton,
      inputStyles,
      placeholderTextColor,
      selectionColor,
      iconStyles,
    } = this.props
    const onSubmitEditing = () => onSearch(searchTerm)
    return (
      <View style={[styles.container, containerStyles]}>
        <Icon
          name="search"
          size={Metrics.icons.tiny}
          style={[styles.searchIcon, iconStyles]}
        />
        <TextInput
          ref="searchText"
          autoFocus={autoFocus}
          placeholder="Search"
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid="transparent"
          style={[styles.searchInput, inputStyles]}
          value={searchTerm}
          onChangeText={onSearch}
          autoCapitalize="none"
          onSubmitEditing={onSubmitEditing}
          returnKeyType={'search'}
          autoCorrect={false}
          selectionColor={selectionColor}
          clearButtonMode="while-editing"
        />
        {cancelButton && (
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.buttonLabel}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}
