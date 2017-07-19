import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
  }

  render () {
    const {story} = this.props
    return (
      <BodyContainer>
        <LimitedWidthContainer>
          <h1>WE NEED TO RENDER THE DRAFTJS STORY HERE LETS MaKE THIS LONGER AND SEE WHAT HAPPENS</h1>
        </LimitedWidthContainer>
        <div>
          <p>Are they trying to do fixed map and/or hidden buttons on the map?</p>
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
