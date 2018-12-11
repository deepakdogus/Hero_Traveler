import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Row } from '../Components/FlexboxGrid'

const Container = styled.div``

const Title = styled.h3`
  padding: 0;
`

const AutocompleteRow = styled(Row)``

class SearchAutocompleteList extends Component {
  static propTypes = {
    label: PropTypes.string,
    autocompleteItems: PropTypes.array,
  }

  render() {
    const { label, autocompleteItems } = this.props
    if (!autocompleteItems.length) return null
    return (
      <Container>
        <Title>{label}</Title>
        {autocompleteItems.map((item, index) => (
          <AutocompleteRow key={index}>{item}</AutocompleteRow>
        ))}
      </Container>
    )
  }
}

export default SearchAutocompleteList
