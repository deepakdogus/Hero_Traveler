import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StorySearchResultRow from './StorySearchResultRow'

const Container = styled.div``

export default class SearchResultsStories extends Component {
  static PropTypes = {
    storySearchResults: PropTypes.object,
    userSearchResults: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const stories = this.props.storySearchResults;
    const users = this.props.userSearchResults;

    /*
      We only need the first 4 elements for suggestions
      We will improve this check to allow 'pagination' will carousel scroll
    */
    const renderedStories = Object.keys(stories).map((key, index) => {
      const story = stories[key]
      if (index >= 4) return null
      return (
        <StorySearchResultRow
          story={story}
          author={users[story.author].username}
          key={index}
          index={index}
          margin='0 0 25px'
        />
      )
    })

    return (
      <Container>
        {renderedStories}
      </Container>
    )
  }
}

