import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultPlayer as VideoWithControls } from 'react-html5video'
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
    return (
      withPrettyControls 
      ?
      <VideoWithControls
        autoPlay={type==='cover'}
        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
        onCanPlayThrough={console.log('Video can play through')} // eslint-disable-line no-console
      >
        <source src={src} type="video/webm" /> 
    </VideoWithControls>
    : 
     <VideoWrapper>
        <StyledVideo src={src} type={type} controls={!this.props.noControls || null}/>
      </VideoWrapper>
    )
  }
}
