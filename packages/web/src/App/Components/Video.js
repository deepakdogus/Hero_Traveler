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
    type: PropTypes.oneOf(['cover', 'preview']),
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
    const {src, type, withPrettyControls } = this.props
    const usingChrome = browserIs('Chrome')

    if (withPrettyControls && usingChrome) {
      return (
        <VideoWithControls
          ref={this.setRef}
          onError={this.showErrorAlert}
          autoPlay={type === 'cover'}
          controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
        >
          <source
            src={src}
            type='video/webm'
          />
        </VideoWithControls>
      )
    }

    return (
      <VideoWrapper>
        <StyledVideo
          autoplay
          src={src}
          type={type}
          controls={!this.props.noControls}
        />
      </VideoWrapper>
    )
  }
}

export default videoConnect(Video)
