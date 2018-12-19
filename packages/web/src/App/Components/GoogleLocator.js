import React from 'react'
import PropTypes from 'prop-types'

import PlacesAutocomplete from 'react-places-autocomplete'
import ExtendedPlacesAutocomplete from './Extensions/ExtendedPlacesAutocomplete'

class GoogleLocator extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    renderChildren: PropTypes.func,
    isSearch: PropTypes.bool,
  }

  render = () => {
    const { value, onChange, onSelect, renderChildren, isSearch } = this.props
    const GoogleLocator = isSearch
      ? ExtendedPlacesAutocomplete
      : PlacesAutocomplete

    return (
      <GoogleLocator
        value={value}
        onChange={onChange}
        onSelect={onSelect}
      >
        {renderChildren}
      </GoogleLocator>
    )
  }
}

export default GoogleLocator
