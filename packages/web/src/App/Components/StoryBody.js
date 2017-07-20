import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StoryContent from './StoryContent'
import GMap from './GoogleMap'
import StoryMetaInfo from './StoryMetaInfo'
import StoryActionBar from './StoryActionBar'

const BodyContainer = styled.div``

const LimitedWidthContainer = styled.div`
  width: 66%;
  max-width: 900px;
  margin: 0 auto;
`

export default class StoryBody extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render () {
    const {story} = this.props
    return (
      <BodyContainer>
        <LimitedWidthContainer>
          <StoryContent story={story} />
        </LimitedWidthContainer>
        <div>
          <p style={{paddingLeft: '10px'}}>Are they trying to do fixed map and/or hidden buttons on the map?</p>
        </div>
        <GMap
          lat={story.latitude}
          lng={story.longitude}
        />
        <LimitedWidthContainer>
          <StoryMetaInfo story={story}/>
          <StoryActionBar story={story}/>
        </LimitedWidthContainer>
      </BodyContainer>
    )
  }
}
