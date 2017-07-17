import React, { Component } from 'react'
import StoryList from '../Components/StoryList'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import ContentLayout from '../Components/ContentLayout.component';

class Feed extends Component {
  render() {
    return (
      <ContentLayout>
        <StoryList
          stories={feedExample}
          users={usersExample}
        />
      </ContentLayout>
    )
  }
}

export default Feed
