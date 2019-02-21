import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import videoConnect, { DefaultPlayer as VideoWithControls } from 'react-html5video'
import 'react-html5video/dist/styles.css';
import { browserIs } from '../Shared/Lib/browserIs'
import '../../video-styles.css'

const VideoWrapper = styled.figure`
  text-align: center;
  background-color: ${props => props.theme.Colors.background};
  margin: 0;
  max-height: ${props => props.type === 'cover' ? '60vh' : '600px'};
`

const StyledVideo = styled.video`
  max-height: ${props => props.type === 'cover' ? '60vh' : '600px'};
  max-width: 100%;
`

class Video extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    webmSrc: PropTypes.string,
    mp4Src: PropTypes.oneOf(['cover', 'preview']),
    noControls: PropTypes.bool,
    withPrettyControls: PropTypes.bool,
    onError: PropTypes.func,
    width: PropTypes.string,
    video: PropTypes.object,
    videoEl: PropTypes.object,
  }

  componentDidUpdate = (prevProps) => {
    const { src, videoEl } = this.props
    if (src && src !== prevProps.src) {
      videoEl.load()
    }
  }

  showErrorAlert = () => {
    const {onError} = this.props
    let alertMessage = 'There was a problem processing your video.'
    if (onError) alertMessage = alertMessage += '\nPlease reformat your file and try again.'
    alert(alertMessage)
    if (onError) onError()
  }

  setRef = (ref) => this.videoRef = ref

  render() {
    const {src, mp4Src, webmSrc, type, withPrettyControls } = this.props
    const usingChrome = browserIs('Chrome')

    if (withPrettyControls && usingChrome) {
      return (
        <VideoWithControls
          ref={this.setRef}
          onError={this.showErrorAlert}
          autoPlay={type === 'cover'}
          controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
        >
          {webmSrc && (
            <source
              src={webmSrc}
              type='video/webm'
            />
          )}
          {mp4Src && (
            <source
              src={mp4Src}
              type='video/mp4'
            />
          )}
          <source
            src={src}
            type='video/mp4'
          />
        </VideoWithControls>
      )
    }

    return (
      <VideoWrapper>
        <StyledVideo
          autoplay
          controls={!this.props.noControls}
        >
         {webmSrc && (
            <source
              src={webmSrc}
              type='video/webm'
            />
          )}
          {mp4Src && (
            <source
              src={mp4Src}
              type='video/mp4'
            />
          )}
          <source
            src={src}
            type='video/mp4'
          />
        </StyledVideo>
      </VideoWrapper>
    )
  }
}

export default videoConnect(Video)
