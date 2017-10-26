import React, { Component } from 'react'
import styled from 'styled-components'

import AddCoverPhotoBox from '../Components/CreateStory/AddCoverPhotoBox'
import CoverPhotoBox from '../Components/CreateStory/CoverPhotoBox'
import PhotoBox from '../Components/CreateStory/PhotoBox'
import VideoBox from '../Components/CreateStory/VideoBox'
import StoryDetails from '../Components/CreateStory/StoryDetails'
import AddContentToolbar from '../Components/CreateStory/AddContentToolbar'
import FooterToolbar from '../Components/CreateStory/FooterToolbar'

import {feedExample} from './Feed_TEST_DATA'

// Demo Story
const testStory = feedExample['59dbd82b4722340010b12cc1'];

const testCoverImage = testStory.coverImage || testStory.coverVideo

const testImageURL = testStory.draftjsContent.blocks[1].data.url

const testVideoURL = testStory.draftjsContent.blocks[3].data.url

const testImageCaption = testStory.draftjsContent.blocks[1].text

const testVideoCaption = testStory.draftjsContent.blocks[3].text

//----------------

const Container = styled.div``

const ContentWrapper = styled.div`
  margin: 0 17%;
`

const StyledContentWrapper = styled(ContentWrapper)`
  margin-bottom: 400px;
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

export default class CreateStory extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  addCover = () => { alert("SELECT COVER IMAGE") }

  render() {
    return (
      <Container>
        <ContentWrapper>
          <ItemContainer>
            <AddCoverPhotoBox
              action={this.addCover}
              workingDraft={testStory}
            />
            <CoverPhotoBox
              coverImage={testCoverImage}
              title={testStory.title}
              description={testStory.description}
              closeImage={this.closeImage}
            />
            <PhotoBox
              closeImage={this.closeImage}
              imageURL={testImageURL}
              caption={testImageCaption}
            />
            <VideoBox
              closeImage={this.closeVideo}
              videoURL={testVideoURL}
              caption={testVideoCaption}
            />
            <AddContentToolbar/>
          </ItemContainer>
        </ContentWrapper>
          <FooterToolbar isDetailsView={false}/>
          <br/>
          <br/>
          <br/>
        <StyledContentWrapper>
          <StoryDetails
            title={testStory.title}
          />
        </StyledContentWrapper>
          <FooterToolbar isDetailsView={true}/>
      </Container>
    )
  }
}

