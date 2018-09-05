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
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 700;
  font-size: 38px;
  line-height: 50px;
  color: ${props => props.theme.Colors.background};
`

const GuideTitle = styled(Title)`
  margin-bottom: 35px;
`

const Subtitle = styled.p`
  margin: 7.5px 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
`

const LocationText = styled(Subtitle)`
  color: ${props => props.theme.Colors.background};
  text-transform: uppercase;
  font-weight: 600;
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
  color: ${props => props.theme.Colors.background};
`

const CoverImage = styled.img`
  width: 100%;
  text-align: center;
  font-style: italic;
`

const CoverCaption = styled.p`
  width: 100%;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-style: italic;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.bioGrey};
  letter-spacing: .7px;
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

const BadgeIcon = styled(Icon)`
  margin-left: ${props => props.profileAvatar ? '0' : '10'}px;
`

export default class FeedItemHeader extends React.Component {
  static propTypes = {
    feedItem: PropTypes.object,
    author: PropTypes.object,
    sessionUserId: PropTypes.string,
    isFollowing: PropTypes.bool,
    unfollowUser: PropTypes.func,
    followUser: PropTypes.func,
    reroute: PropTypes.func,
    isStory: PropTypes.bool,
  }

  getMediaType() {
    const {feedItem} = this.props
    if (feedItem.coverVideo && !feedItem.coverImage) return 'video'
    if (feedItem.coverImage) return 'image'
    return undefined
  }

  getCoverImage() {
    const {feedItem} = this.props
    if (this.getMediaType() === 'video') {
      return getImageUrl(feedItem.coverVideo, 'video')
    }
    return getImageUrl(feedItem.coverImage)
  }

  _profileReroute = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _editReroute = () => {
    this.props.reroute(`/editStory/${this.props.feedItem.id}`)
  }

  render() {
    const {
      feedItem,
      author,
      sessionUserId,
      isFollowing,
      unfollowUser,
      followUser,
      isStory,
    } = this.props

    const mediaType = this.getMediaType()
    const hasBadge = author.role === 'contributor' || author.role === 'founding member'
    const isUsersFeedItem = author.id === sessionUserId

    return (
      <Container>
        <TopRow between="xs">
          <Row>
            <Avatar
              avatarUrl={getImageUrl(author.profile.avatar)}
              size='medium'
              onClick={this._profileReroute}
            />
            {hasBadge &&
              <VerticalCenter>
                <BadgeIcon
                name={author.role === 'contributor' ? 'profileBadge' : 'founderBadge'}
                size='mediumSmall'
                profileAvatar={author.profile.avatar}
                />
              </VerticalCenter>
            }
            <SpacedVerticalCenter>
              <Username onClick={this._profileReroute}>{author.username}</Username>
              <TimeStamp>{moment(feedItem.createdAt).fromNow()}</TimeStamp>
            </SpacedVerticalCenter>
            {!isUsersFeedItem && sessionUserId &&
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
          {isUsersFeedItem &&
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
        {!isStory &&
          <GuideTitle mediaType={mediaType}>{feedItem.title}</GuideTitle>
        }
        {
          mediaType === 'image' &&
          <CoverImage
            src={this.getCoverImage()}
          />
        }
        {
          mediaType === 'video' &&
          <Video
            src={getVideoUrl(feedItem.coverVideo, false)}
            type='cover'
            withPrettyControls
          />
        }
        {isStory &&
          <div>
            <CoverCaption>{feedItem.coverCaption}</CoverCaption>
            <LocationText>{displayLocationPreview(feedItem.locationInfo)}</LocationText>
            <Title mediaType={mediaType}>{feedItem.title}</Title>
            <Subtitle>{feedItem.description}</Subtitle>
          </div>
        }
      </Container>
    )
  }
}
