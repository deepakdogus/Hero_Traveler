import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AutocompleteRow from './SearchAutocompleteRow'
import { ItemContainer, ListTitle } from '../Containers/Search'

class SearchAutocompleteList extends Component {
  static propTypes = {
    label: PropTypes.string,
    autocompleteItems: PropTypes.array,
    navigate: PropTypes.func,
  }

  render() {
    const { label, autocompleteItems, navigate } = this.props
    if (!autocompleteItems.length) return null

    return (
      <ItemContainer>
        {label && <ListTitle>{label}</ListTitle>}
        {autocompleteItems.map((item, idx) => {
          if (!item) return null
          return (
            <AutocompleteRow
              key={item.id}
              idx={idx}
              item={item}
              navigate={navigate}
            />
          )
        })}
      </ItemContainer>
    )
  }
}

export default SearchAutocompleteList
