import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'

const tabBarTabs = ['ALL', 'DO', 'EAT', 'STAY']

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'ALL'
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  render() {
    const user = usersExample['59d64ca84722340010b12c98']
    const usersStories = Object.keys(feedExample).reduce((matchingStories, key) => {
      const story = feedExample[key]
      if (story.author === user.id) matchingStories[key] = story;
      return matchingStories
    }, {})

    return (
      <ContentWrapper>
        <CategoryHeader/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <StoryListWrapper>
          <StoryList stories={usersStories} users={usersExample}/>
          <ShowMore/>
          <Footer />
        </StoryListWrapper>
      </ContentWrapper>
    )
  }
}

export default Category
