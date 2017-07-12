import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryPreview from './StoryPreview'
const Container = styled.div`
  padding: 0px 7.5%;
`

export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.object,
    users: PropTypes.object,
  }

  render() {
    const {stories, users} = this.props
    const renderedStories = Object.keys(stories).map(key => {
      return (
        <StoryPreview 
          key={key} 
          story={stories[key]}
          author={users[stories[key].author]}
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