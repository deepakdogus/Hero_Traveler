import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import RoundedButton from '../../RoundedButton'
import {feedExample} from '../../../Containers/Feed_TEST_DATA'
import {
  Container,
  Title,
} from '../../Modals/Shared'
import StorySelectRow from '../../StorySelectRow'
import {Row} from '../../FlexboxGrid'

const StoriesContainer = styled.div`
  padding-bottom: 50px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
`

const StyledContainer = styled(Container)`
  height: 100%;
`

const storyKeys = Object.keys(feedExample).filter((key, index) => {
  const story = feedExample[key]
  return story.coverImage
})

export default class AddToItinerary extends React.Component {
  static PropTypes = {
    onAddClick: PropTypes.func,
    stories: PropTypes.object,
  }

  renderStoryRows() {
    return storyKeys.map((key, index) => {
      return (
        <StorySelectRow
          key={key}
          index={index}
          story={feedExample[key]}
          isSelected={index === 0}
          renderRight
        />
      )
    })
  }

  render() {
    return (
      <StyledContainer>
        <Title>ADD A STORY TO INDIAN ADVENTURE</Title>
        <StoriesContainer>
          {this.renderStoryRows()}
        </StoriesContainer>
        <Footer>
          <Row center='xs'>
            <RoundedButton
              text='Cancel'
              margin='small'
              type='blackWhite'
            />
            <RoundedButton
              text='Add to Itinerary'
              margin='small'
            />
          </Row>
        </Footer>
      </StyledContainer>
    )
  }
}
