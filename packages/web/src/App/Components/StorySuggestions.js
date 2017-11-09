import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StoryList from './StoryList'

const SuggestionsContainer = styled.div`
  padding: 50px 0 100px;
`

const Title = styled.p`
  font-weight: 400;
  font-size: 23px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  margin: 25px 0 10px;
`

export default class StorySuggestions extends React.Component {
  static propTypes = {
    suggestedStories: PropTypes.array,
    users: PropTypes.object,
  }

  render() {
    const {suggestedStories, users} = this.props
    return (
      <SuggestionsContainer>
        <Title>STORIES YOU MAKE LIKE</Title>
        <StoryList stories={suggestedStories} users={users} type='suggestions'/>
      </SuggestionsContainer>
    )
  }
}
