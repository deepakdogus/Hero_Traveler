import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
    src: PropTypes.string6
    type: PropTypes.oneOf(['cover', 'preview']),
    noControls: PropTypes.bool,
  }

  render() {
    const {src, type} = this.props
    return (
      <VideoWrapper>
        <StyledVideo src={src} type={type} controls={!this.props.noControls || null}/>
      </VideoWrapper>
    )
  }
}
