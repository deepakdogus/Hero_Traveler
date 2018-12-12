import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {getLatLng, geocodeByAddress} from 'react-places-autocomplete'

import HorizontalDivider from '../Components/HorizontalDivider'

const SearchTitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.7px;
`

const AutocompleteRow = styled.div`
  cursor: pointer;
`

class SearchAutocompleteRow extends Component {
  static propTypes = {
    idx: PropTypes.number,
    item: PropTypes.object,
    navToStory: PropTypes.func,
    reroute: PropTypes.func,
  }

  _handleClick = () => {
    const { item, navToStory } = this.props
    if (item.contentType === 'location') return this._navToLocation()
    navToStory(item.id, item.title)
  }

  _navToLocation = async () => {
    const { item, reroute } = this.props
    const results = await geocodeByAddress(item.title)
    const { lat, lng } = await getLatLng(results[0])
    if (lat && lng) reroute({
      pathname: `/results/${lat}/${lng}`,
      search: `?t=${item.title}`,
    })
  }

  render = () => {
    const { idx, item } = this.props
    return (
      <AutocompleteRow
        onClick={this._handleClick}
      >
        {!idx && <HorizontalDivider color="light-grey" />}
        <SearchTitle>{item.title}</SearchTitle>
        <HorizontalDivider color="light-grey" />
      </AutocompleteRow>
    )
  }
}

export default SearchAutocompleteRow
