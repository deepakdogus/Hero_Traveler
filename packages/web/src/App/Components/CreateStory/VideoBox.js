import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Video from '../Video'
import CloseX from '../CloseX'
import {CloseXContainer, StyledCaptionInput} from './Shared'

const Container = styled.div`
`

const VideoContainer = styled(Container)`
  margin-top: 40px;
  max-width: 900px;
  position: relative;
`

export default class VideoBox extends React.Component {
  static propTypes = {
    videoURL: PropTypes.string,
    closeVideo: PropTypes.func,
    caption: PropTypes.string,
  }

  render() {
    const {videoURL, closeVideo, caption} = this.props;
    return (
      <Container>
        <VideoContainer>
          <Video src={videoURL}/>
           <CloseXContainer>
            <CloseX onClick={closeVideo}/>
          </CloseXContainer>                              
        </VideoContainer>
        <StyledCaptionInput placeholder={caption || 'Add a caption'}/>
      </Container>
    )
  }
}













