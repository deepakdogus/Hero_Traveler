import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import ProfileHeader from '../Components/ProfileHeader'
import Togglebar from '../Components/Togglebar'

const ContentWrapper = styled.div``

const toggleBarTabs = [
  { text: 'stories', isActive: true },
  { text: 'drafts', isActive: false },
  { text: 'collections', isActive: false },
]

class Profile extends Component {
  render() {
    const user = usersExample['596cd072fc3f8110a6f18342']
    return (
      <ContentWrapper>
        <ProfileHeader user={user}/>
        <Togglebar tabs={toggleBarTabs}/>
      </ContentWrapper>
    )
  }
}

export default Profile
