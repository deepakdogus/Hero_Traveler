import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import ProfileHeader from '../Components/ProfileHeader'

const ContentWrapper = styled.div``

class Profile extends Component {
  render() {
    const user = usersExample['596cd072fc3f8110a6f18342']
    return (
      <ContentWrapper>
        <ProfileHeader user={user}/>
      </ContentWrapper>
    )
  }
}

export default Profile
