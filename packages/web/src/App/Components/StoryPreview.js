import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Grid, Row, Col } from './FlexboxGrid';
import Avatar from './Avatar'
import LikeComponent from './LikeComponent'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const StoryContainer = styled.div`
  height: 400px;
  width: 100%;
  background-image: ${props => `url(${getImageUrl(props.image)})`};
  background-size: cover;
  color: ${props => props.theme.Colors.lightGrey};
  position: relative;
`

const StoryInfoContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 90%;
  margin: 0 5%;
`

const Username = styled.span``

const Date = styled.span`
  font-style: italic;
  margin-right: 5px;
`

const Title = styled.h3`
  color: ${props => props.theme.Colors.snow};
`

const Right = styled.div`
  float: right;
`

export default class StoryPreview extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render() {
    const {story, author} = this.props
    return (
      <StoryContainer image={story.coverImage || story.coverVideo}>
        <StoryInfoContainer>
          <Title>{story.title}</Title>
          <p>{story.description}</p>
          <hr />
          <div>
            <Avatar avatarUrl={getImageUrl(author.profile.avatar)}/>
            <Username>{author.username}</Username>
            <Right>
              <Date>{moment(story.createdAt).fromNow()}</Date>
              <LikeComponent
                likes={formatCount(story.counts.likes)}
                isLiked={this.props.isLiked}
              />
            </Right>
          </div>
        </StoryInfoContainer>

      </StoryContainer>
    )
  }
}