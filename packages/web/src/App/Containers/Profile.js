import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import ProfileHeader from '../Components/ProfileHeader'
import Togglebar from '../Components/Togglebar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'

const toggleBarTabs = [
  { text: 'stories', isActive: true },
  { text: 'drafts', isActive: false },
  { text: 'collections', isActive: false },
]

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

class Profile extends Component {
  render() {
    const {match} = this.props
    const user = usersExample[match.params.userId] || usersExample['596cd072fc3f8110a6f18342']
    const usersStories = Object.keys(feedExample).reduce((matchingStories, key) => {
      const story = feedExample[key]
      if (story.author === user.id) matchingStories[key] = story;
      return matchingStories
    }, {})
    const isContributor = Object.keys(usersStories).length > 0
    return (
      <ContentWrapper>
        <ProfileHeader user={user} isContributor={isContributor}/>
        <Togglebar tabs={toggleBarTabs}/>
        <StoryListWrapper>
          <StoryList stories={usersStories} users={usersExample}/>
          <Footer />
        </StoryListWrapper>
      </ContentWrapper>
    )
  }
}

export default Profile
