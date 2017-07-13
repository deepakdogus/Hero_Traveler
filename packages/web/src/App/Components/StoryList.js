import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Row, Col } from './FlexboxGrid';
import StoryPreview from './StoryPreview'

export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.object,
    users: PropTypes.object,
  }

  render() {
    const {stories, users} = this.props
    const renderedStories = Object.keys(stories).map(key => {
      return (
        <Col key={key} xs={12} sm={6} md={4} lg={3}>
          <StoryPreview
            story={stories[key]}
            author={users[stories[key].author]}
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