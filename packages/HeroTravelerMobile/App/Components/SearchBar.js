import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput } from 'react-native'
import styles from './Styles/SearchBarStyles'
import { Colors, Metrics } from '../Shared/Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class SearchBar extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchTerm: PropTypes.string
  }

  render() {
    const { onSearch, searchTerm } = this.props

    return (
      <View style={styles.container}>
        <Icon
          name='search'
          size={Metrics.icons.tiny}
          style={styles.searchIcon}
        />
        <TextInput
          ref='searchText'
          autoFocus={false}
          placeholder='Search'
          placeholderTextColor={Colors.grey}
          underlineColorAndroid='transparent'
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={onSearch}
          autoCapitalize='none'
          returnKeyType={'search'}
          autoCorrect={false}
          selectionColor={Colors.red}
          clearButtonMode='while-editing'
        />
      </View>
    )
  }
}
