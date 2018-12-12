import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
    navigate: PropTypes.func,
  }

  handleClick = () => this.props.navigate(this.props.item)

  render = () => {
    const { idx, item } = this.props
    return (
      <AutocompleteRow
        onClick={this.handleClick}
      >
        {!idx && <HorizontalDivider color="light-grey" />}
        <SearchTitle>{item.title}</SearchTitle>
        <HorizontalDivider color="light-grey" />
      </AutocompleteRow>
    )
  }
}

export default SearchAutocompleteRow
