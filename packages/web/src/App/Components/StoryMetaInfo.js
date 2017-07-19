import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';

import Icon from './Icon'
import {Row} from './FlexboxGrid'

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

const Container = styled.div`
  margin: 35px 0;
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

export default class StoryMetaInfo extends React.Component {
  static propTypes = {
    story: PropTypes.object,
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
    const {story} = this.props
    return (
      <Container>
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
      </Container>
    )
  }
}
