import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultPlayer as VideoWithControls } from 'react-html5video'
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

export default class Video extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    type: PropTypes.oneOf(['cover', 'preview']),
    noControls: PropTypes.bool,
    withPrettyControls: PropTypes.bool,
  }

  render() {
    const {src, type, withPrettyControls } = this.props
    const usingChrome = browserIs('Chrome')

    return (
      withPrettyControls && usingChrome
      ?
      <VideoWithControls
        autoPlay={type==='cover'}
        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
      >
        <source src={src} type="video/webm" /> 
    </VideoWithControls>
    : 
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
