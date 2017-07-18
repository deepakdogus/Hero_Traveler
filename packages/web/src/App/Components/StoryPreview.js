import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import {NavLink} from 'react-router-dom';

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import HorizontalDivider from './HorizontalDivider'
import VerticalCenter from './VerticalCenter'
import Overlay from './Overlay'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const StoryLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
`

const ProfileLink = styled(StoryLink)`
  display: flex;
`

const MarginWrapper = styled.div`
  margin: 2px;
  position: relative;
  color: ${props => props.theme.Colors.lightGrey};
`

const StoryOverlayContainer = styled(Overlay)`
  padding-top: 151%;
  width: 100%;
  background-image: ${props => `url(${getImageUrl(props.image)})`};
  background-size: cover;
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
    const image = story.coverImage || story.coverVideo
    return (
      <MarginWrapper>
        <StoryLink to={`/story/${story.id}`}>
          <StoryOverlayContainer
            image={image}
            overlayColor={'rgba(0, 0, 0, 0.4)'}
          />
        </StoryLink>
        <StoryInfoContainer>
          <StoryLink to={`/story/${story.id}`}>
            <Title>{story.title}</Title>
            <Description>{story.description}</Description>
          <HorizontalDivider opaque />
          </StoryLink>
          <DetailsContainer>
            <ProfileLink to='/signup/social'>
              <Avatar avatarUrl={getImageUrl(author.profile.avatar)} size='large'/>
              <VerticalCenter>
                <Username>{author.username}</Username>
              </VerticalCenter>
            </ProfileLink>
            <StoryLink to={`/story/${story.id}`}>
            <Right>
                <div>
                  <CreatedAt>{moment(story.createdAt).fromNow()}</CreatedAt>
                  <LikeComponent
                    likes={formatCount(story.counts.likes)}
                    isLiked={this.props.isLiked}
                  />
                </div>
            </Right>
              </StoryLink>
          </DetailsContainer>
        </StoryInfoContainer>
      </MarginWrapper>
    )
  }
}
