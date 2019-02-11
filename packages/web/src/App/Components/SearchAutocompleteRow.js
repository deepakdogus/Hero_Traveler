import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import HorizontalDivider from '../Components/HorizontalDivider'

const AutocompleteRow = styled.div`
  cursor: pointer;
`

const TextContainer = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`

const PrimaryText = styled.span`
  font-weight: 600;
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.7px;
`

const SecondaryText = styled(PrimaryText)`
  font-weight: 400;
  color: ${props => props.theme.Colors.grey};
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
        <TextContainer>
          <PrimaryText>
            {`${item.title}${item.secondaryText ? ',' : ''}`}
          </PrimaryText>
          <span>&nbsp;</span>
          {item.secondaryText && (
            <SecondaryText>
              {item.secondaryText.replace(/, USA/g, '')}
            </SecondaryText>
          )}
        </TextContainer>
        <HorizontalDivider color="light-grey" />
      </AutocompleteRow>
    )
  }
}

export default SearchAutocompleteRow
