import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import Video from '../Video'
import RoundedButton from '../RoundedButton'

const Container = styled.div`
`

const VideoContainer = styled(Container)`
  margin-top: 40px;
  max-width: 900px;
  position: relative;
`

// const StyledImage = styled(Image)`
//   width: 100%;
// `

const Caption = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
`

const CloseVideo = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 100;
`

export default class VideoBox extends React.Component {
  static propTypes = {
    videoURL: PropTypes.string,
    closeVideo: PropTypes.func,
    caption: PropTypes.string,
  }

  render() {
      return (
        <Container>
          <VideoContainer>
            <Video src={this.props.videoURL}/>
             <CloseVideo>
              <RoundedButton 
                type='grey'
                padding='even' 
                margin='small'
                onClick={this.props.closeVideo}
              >
                <Icon name='close'/>
              </RoundedButton>                  
            </CloseVideo>                              
          </VideoContainer>
          {this.props.caption && <Caption>{this.props.caption}</Caption>}
        </Container>
      )
  }
}













