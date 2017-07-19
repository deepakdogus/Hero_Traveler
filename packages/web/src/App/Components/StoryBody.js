import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';

import Icon from './Icon'
import {Row} from './FlexboxGrid'
import StoryActionBar from './StoryActionBar'

const BodyContainer = styled.div``

const LimitedWidthContainer = styled.div`
  width: 66%;
  max-width: 900px;
  margin: 0 auto;
`

const LocationIcon = styled(Icon)`
  padding: 3px 2px 0;
  width: 11px;
  height: 18px;
`

const TagsIcon = styled(Icon)`
  padding-top: 3px;
  width: 15px;
  height: 15px;
`

const Text = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
`

const Label = styled(Text)`
  margin: 0;
`

const Location = styled(Text)`
  font-weight: 400;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const TextContainer = styled.div`
  margin-left: 20px;
`

const StyledLink = styled(NavLink)`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .7px;
  text-decoration: none;
`

export default class StoryBody extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  renderTagLinks (tags) {
    const keys = Object.keys(tags)
    const length = keys.length;
    return keys.map((key, index) => {
      const tag = tags[key]

      return (
        <StyledLink key={key} to='/'>
          {tag.title}{index !== length-1 ? ', ' : ''}
        </StyledLink>
      )
    })
  }

  render () {
    const {story, author} = this.props
    console.log("story is", story)
    console.log("author is", author)
    return (
      <BodyContainer>
        <LimitedWidthContainer>
          <h1>WE NEED TO RENDER THE DRAFTJS STORY HERE LETS MaKE THIS LONGER AND SEE WHAT HAPPENS</h1>
        </LimitedWidthContainer>
        <div>
          <h3>ADD MAP HERE! BUT WE ARE MUCH WIDER BECAUSE THIS IS WHERE THE MAP GOES! WEEE LOOK HOW WIDE WE CAN GET. TAKE IT LimitedWidthContainer</h3>
        </div>
        <LimitedWidthContainer>
          <Row>
            <LocationIcon name='location' />
            <TextContainer>
              <Label>Location:</Label>
              <Location>{story.location}</Location>
            </TextContainer>
          </Row>
          <Row>
            <TagsIcon name='tag' />
            <TextContainer>
              <Label>Tags:</Label>
              {this.renderTagLinks(story.categories)}
            </TextContainer>
          </Row>
          <StoryActionBar story={story}/>
        </LimitedWidthContainer>
      </BodyContainer>
    )
  }
}
