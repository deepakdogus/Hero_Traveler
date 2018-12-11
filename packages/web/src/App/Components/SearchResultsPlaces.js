import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import FeedItemSelectRow, {DefaultContainer} from './FeedItemSelectRow'

const Container = styled.div``

const StyledContainer = styled(DefaultContainer)`
  border-width: ${props => props.index !== 0 ? '1px 0 0 0' : '0'};
  padding: 10px 0px 6px;
`

export default class SearchResultsPlaces extends Component {
  static propTypes = {
    storySearchResults: PropTypes.object,
    navToStory: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const stories = this.props.storySearchResults.hits || []
    const renderedStories = stories.map((story, index) => {
      if(story.coverVideo) return null
      return (
        <FeedItemSelectRow
          story={story}
          username={story.author}
          key={index}
          index={index}
          ReplacementContainer={StyledContainer}
          navToStory={this.props.navToStory}
          isVertical
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
