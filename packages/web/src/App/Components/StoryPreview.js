import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import Avatar from './Avatar'
import FloatRight from './FloatRight'
import LikeComponent from './LikeComponent'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const StoryContainer = styled.div`
  display: inline-block;
  height: 400px;
  width: 24%;
  background-image: ${props => `url(${getImageUrl(props.image)})`};
  background-size: cover;
  color: ${props => props.theme.Colors.lightGrey};
  margin: 2.5px;
  padding: 0 1.5%;
  position: relative;
`

const StoryInfoContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 89%;
`

const StoryDetailsContainer = styled.div``

const Username = styled.span``

const Date = styled.span`
  font-style: italic;
  margin-right: 5px;
`

const Title = styled.h3`
  color: ${props => props.theme.Colors.snow};
`

export default class StoryPreview extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render() {
    const {story, author} = this.props
    console.log("story is", story);
    return (
      <StoryContainer image={story.coverImage || story.coverVideo}>
        <StoryInfoContainer>
          <Title>{story.title}</Title>
          <p>{story.description}</p>
          <hr />
          <StoryDetailsContainer>
            <Avatar avatarUrl={getImageUrl(author.profile.avatar)}/>
            <Username>{author.username}</Username>
            <FloatRight>
              <Date>{moment(story.createdAt).fromNow()}</Date>
              <LikeComponent
                likes={formatCount(story.counts.likes)}
                isLiked={this.props.isLiked}
              />
            </FloatRight>
          </StoryDetailsContainer>
        </StoryInfoContainer>

      </StoryContainer>
    )
  }
}