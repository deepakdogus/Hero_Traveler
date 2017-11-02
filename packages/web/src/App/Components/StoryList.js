import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from './FlexboxGrid';
import StoryPreview from './StoryPreview'

const defaultAttributes = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 3,
}

const suggestedStoriesAttributes = {
  xs: 3
}

export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.object,
    type: PropTypes.string,
  }

  render() {
    const {stories, users = {}, type} = this.props
    const colAttributes = type === 'suggestions' ? suggestedStoriesAttributes : defaultAttributes
    const renderedStories = stories.map((story, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      if (type === 'suggestions' && index >= 4) return null
      return (
        <Col key={story.id} {...colAttributes}>
          <StoryPreview
            story={story}
            author={users[story.author]}
            type={type}
          />
        </Col>
      )
    })
    return (
      <Grid fluid>
        <Row>
          {renderedStories}
        </Row>
      </Grid>
    )
  }
}
