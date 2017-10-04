import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StorySelectRow, {DefaultContainer} from './StorySelectRow'

const Container = styled.div``

const StyledContainer = styled(DefaultContainer)`
  border-width: ${props => props.index !== 0 ? '2px 0 0' : '0'};
  padding: 10px 0px 6px;
`

const textStyles = `
  font-weight: 600;
  font-size: 18px;
`

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
        <StorySelectRow
          story={story}
          username={users[story.author].username}
          key={index}
          index={index}
          textStyles={textStyles}
          container={StyledContainer}
          ReplacementContainer={StyledContainer}
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

