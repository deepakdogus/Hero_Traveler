import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import HorizontalDivider from './HorizontalDivider'
import OverlayHover from './OverlayHover'
import {Row} from './FlexboxGrid'
import NavLinkStyled from './NavLinkStyled'
import PlayButton from './PlayButton'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const StoryLink = styled(NavLinkStyled)``

const FlexStoryLink = styled(StoryLink)`
  display: flex;
`

const ProfileLink = styled(StoryLink)`
  display: flex;
`

const MarginWrapper = styled.div`
  margin: 2px;
  position: relative;
  color: ${props => props.theme.Colors.lightGrey};
`

const StoryOverlayContainer = styled(OverlayHover)`
  padding-top: 151%;
  width: 100%;
  background-image: ${props => `url(${props.imageUrl})`};
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
  font-family: ${props => props.theme.Fonts.type.base};
  color: ${props => props.theme.Colors.lightGrey};
  letter-spacing: .7px;
  font-size: 12px;
  font-weight: 400;
  margin-left: 10px;
`

const CreatedAt = styled.span`
  font-family: ${props => props.theme.Fonts.type.crimsonText};
  color: ${props => props.theme.Colors.lightGrey};
  font-weight: 400
  letter-spacing: .5px;
  font-size: 12px;
  font-style: italic;
  margin-right: 5px;
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  letter-spacing: 1.5px;
  font-size: 20px;
  color: ${props => props.theme.Colors.snow};
  text-transform: uppercase;
  margin: 0 0 5px;
`

const Description = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400px;
  color: ${props => props.theme.Colors.lightGrey};
  letter-spacing: .7px;
  font-size: 14px;
  margin: 0;
`

const DetailsContainer = styled(Row)`
  display: flex;
  position: relative;
`

const ContainerBottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 220px;
  background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.6));
`

export default class StoryPreview extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render() {
    const {story, author, type} = this.props
    let imageUrl;
    if (story.coverImage) imageUrl = getImageUrl(story.coverImage)
    else if (story.coverVideo) imageUrl = getImageUrl(story.coverVideo, 'video')

    return (
      <MarginWrapper>
        <StoryLink to={`/story/${story.id}`}>
          <StoryOverlayContainer
            imageUrl={imageUrl}
            overlayColor='black'
          >
            {story.coverVideo && <PlayButton/>}
            <ContainerBottomGradient/>
          </StoryOverlayContainer>
        </StoryLink>
        <StoryInfoContainer>
          <StoryLink to={`/story/${story.id}`}>
            <Title>{story.title}</Title>
            { type !== 'suggestions' &&
              <div>
                <Description>{story.description}</Description>
                <HorizontalDivider opaque />
              </div>
            }
          </StoryLink>
          { type !== 'suggestions' &&
            <DetailsContainer between='xs'>
              <ProfileLink to={`/profile/${author.id}`}>
                <Row middle='xs'>
                  <Avatar avatarUrl={getImageUrl(author.profile.avatar, 'avatar')} size='large'/>
                  <Username>{author.username}</Username>
                </Row>
              </ProfileLink>
              <FlexStoryLink to={`/story/${story.id}`}>
                <Row between='xs' middle='xs'>
                  <CreatedAt>{moment(story.createdAt).fromNow()}</CreatedAt>
                  <LikeComponent
                    likes={formatCount(story.counts.likes)}
                    isLiked={this.props.isLiked}
                  />
                </Row>
              </FlexStoryLink>
            </DetailsContainer>
          }
        </StoryInfoContainer>
      </MarginWrapper>
    )
  }
}
