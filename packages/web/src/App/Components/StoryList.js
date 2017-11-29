import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StoryPreview from './StoryPreview'
import HorizontalDivider from './HorizontalDivider'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
`

export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
  }

  render() {
    const {stories, type} = this.props
    const renderedStories = stories.reduce((rows, story, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      if (type === 'suggestions' && index >= 4) return null
      if (!story) return rows
      if (index !== 0) {
        rows.push((
          <StyledDivider key={`hr-${story.id}`} color='lighter-grey'/>
        ))
      }
      rows.push((
        <StoryPreview
          key={story.id}
          story={story}
          type={type}
        />
      ))
      return rows
    }, [])
    return (
      <div>
        {renderedStories}
      </div>
    )
  }
}
