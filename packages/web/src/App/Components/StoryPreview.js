import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import HorizontalDivider from './HorizontalDivider'
import VerticalCenter from './VerticalCenter'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const MarginWrapper = styled.div`
  margin: 2px
`

const StoryContainer = styled.div`
  padding-top: 151%;
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
  margin: 0 5% 2.5%;
`

const Username = styled.p`
  letter-spacing: .7px;
  font-size: 14px;
  font-weight: 400;
  margin-left: 10px;
`

const CreatedAt = styled.span`
  font-weight: 400
  letter-spacing: .5px;
  font-size: 12px;
  font-style: italic;
  margin-right: 5px;
`

const Title = styled.h3`
  font-weight: 400;
  letter-spacing: 1.5px;
  font-size: 20px;
  color: ${props => props.theme.Colors.snow};
  text-transform: uppercase;
  margin: 0 0 5px;
`

const Description = styled.p`
  font-weight: 400px;
  letter-spacing: .7px;
  font-size: 14px;
  margin: 0;
`

const Right = styled(VerticalCenter)`
  position: absolute;
  right: 0;
  height: 100%;
`

const DetailsContainer = styled.div`
  display: flex;
  position: relative;
`

export default class StoryPreview extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render() {
    const {story, author} = this.props
    return (
      <MarginWrapper>
        <StoryContainer image={story.coverImage || story.coverVideo}>
          <StoryInfoContainer>
            <Title>{story.title}</Title>
            <Description>{story.description}</Description>
            <HorizontalDivider opaque />
            <DetailsContainer>
              <Avatar avatarUrl={getImageUrl(author.profile.avatar)} size='large'/>
              <VerticalCenter>
                <Username>{author.username}</Username>
              </VerticalCenter>
              <Right>
                <div>
                  <CreatedAt>{moment(story.createdAt).fromNow()}</CreatedAt>
                  <LikeComponent
                    likes={formatCount(story.counts.likes)}
                    isLiked={this.props.isLiked}
                  />
                </div>
              </Right>
            </DetailsContainer>
          </StoryInfoContainer>
        </StoryContainer>
      </MarginWrapper>
    )
  }
}
