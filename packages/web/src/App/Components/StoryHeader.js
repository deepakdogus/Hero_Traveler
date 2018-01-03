import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'

import Avatar from './Avatar'
import VerticalCenter from './VerticalCenter'
import {Row} from './FlexboxGrid';
import Video from './Video'
import RoundedButton from './RoundedButton'
import Icon from './Icon'

const Title = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 700;
  font-size: 38px;
  line-height: 50px;
  color: ${props => props.theme.Colors.background};
`

const RedText = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .7px;
`

const Username = styled(RedText)`
  cursor: pointer;
`

const TimeStamp = styled(RedText)`
  font-style: italic;
  font-size: 14px;
  color: ${props => props.theme.Colors.background}
`

const CoverImage = styled.img`
  width: 100%;
`

const Container = styled.div`
  margin: 65px auto 0;
  max-width: 800px;
  padding-left: 45px;
  padding-right: 45px;
`

const TopRow = styled(Row)`
  margin-bottom: 35px !important;
`

const PencilIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  margin-right: 5px;
`

const SpacedVerticalCenter = styled(VerticalCenter)`
  margin-left: 15px;
`

const ClickableRow = styled(Row)`
  cursor: pointer;
`

export default class StoryHeader extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    reroute: PropTypes.func,
  }

  getMediaType() {
    const {story} = this.props
    if (story.coverVideo && !story.coverImage) return 'video'
    if (story.coverImage) return 'image'
    return undefined
  }

  getCoverImage() {
    const {story} = this.props
    if (this.getMediaType() === 'video') {
      return getImageUrl(story.coverVideo, 'video')
    }
    return getImageUrl(story.coverImage)
  }

  _profileReroute = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _editReroute = () => {
    this.props.reroute(`/createStoryNew/${this.props.story.id}`)
  }

  render () {
    const {
      story, author, sessionUserId,
      isFollowing, unfollowUser, followUser
    } = this.props

    const mediaType = this.getMediaType()
    const isUsersStory = author.id === sessionUserId
    return (
      <Container>
        <TopRow between="xs">
          <Row>
            <Avatar
              avatarUrl={getImageUrl(author.profile.avatar)}
              size='medium'
              onClick={this._profileReroute}
            />
            <SpacedVerticalCenter>
              <Username onClick={this._profileReroute}>{author.username}</Username>
              <TimeStamp>{moment(story.createdAt).fromNow()}</TimeStamp>
            </SpacedVerticalCenter>
            {!isUsersStory && sessionUserId &&
              <SpacedVerticalCenter>
                <RoundedButton
                  margin='none'
                  onClick={isFollowing ? unfollowUser : followUser}
                  type={isFollowing ? 'blackWhite' : ''}
                  text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                />
              </SpacedVerticalCenter>
            }
          </Row>
          {isUsersStory &&
            <VerticalCenter>
              <ClickableRow onClick={this._editReroute}>
                <PencilIcon
                  name='pencilBlack'
                />
                <RedText>Edit Story</RedText>
              </ClickableRow>
            </VerticalCenter>
          }
        </TopRow>
        {mediaType === 'image' &&
          <CoverImage
            src={this.getCoverImage()}
          />
        }
        {mediaType === 'video' &&
          <Video
            src={getVideoUrl(story.coverVideo, false)}
            type='cover'
            withPrettyControls
          />
        }
        <Title mediaType={mediaType}>{story.title}</Title>

      </Container>
    )
  }
}
