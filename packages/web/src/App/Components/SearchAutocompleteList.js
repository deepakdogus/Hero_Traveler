import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import AutocompleteRow from './SearchAutocompleteRow'

const Container = styled.div``

const ListTitle = styled.p`
  padding-top: 30px;
  font-weight: 600;
  font-size: 20px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.7px;
`

class SearchAutocompleteList extends Component {
  static propTypes = {
    label: PropTypes.string,
    autocompleteItems: PropTypes.array,
    navToStory: PropTypes.func,
  }

  render() {
    const { label, autocompleteItems, navToStory, reroute } = this.props
    if (!autocompleteItems.length) return null

    return (
      <Container>
        <ListTitle>{label}</ListTitle>
        {autocompleteItems.map((item, idx) => {
          if (!item) return null
          return (<AutocompleteRow
            key={item.id}
            idx={idx}
            item={item}
            navToStory={navToStory}
            reroute={reroute}
          />)
        })}
      </Container>
    )
  }
}

export default SearchAutocompleteList
