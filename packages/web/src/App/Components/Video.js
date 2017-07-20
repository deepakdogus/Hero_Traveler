import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const VideoWrapper = styled.figure`
  text-align: center;
  background-color: ${props => props.theme.Colors.background};
  margin: 0;
  max-height: 700px;
`

const StyledVideo = styled.video`
  max-height: 700px;
  max-width: 100%;
`

export default class Video extends React.Component {
  static propTypes = {
    src: PropTypes.string,
  }

  render() {
    const {src} = this.props
    return (
      <VideoWrapper>
        <StyledVideo src={src} controls/>
      </VideoWrapper>
    )
  }
}
