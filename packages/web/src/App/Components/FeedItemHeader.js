import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'

import Avatar from './Avatar'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import {Row} from './FlexboxGrid'
import Video from './Video'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import { displayLocationPreview } from '../Shared/Lib/locationHelpers'

const UserInfoRow = styled(Row)`
  align-items: center;
`

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 38px;
  line-height: 50px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .6px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 30px;
  }
`

const GuideTitle = styled(Title)`
  margin-bottom: 35px;
  font-weight: 700;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 45px;
    padding-right: 45px;
    font-size: 30px;
  }
`

const Subtitle = styled.p`
  margin: 7.5px 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .2px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
  }
`

const LocationText = styled(Subtitle)`
  margin-top: 45px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  text-transform: uppercase;
  font-weight: 600;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
  }
`

const RedText = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: .2px;
`

const Username = styled(RedText)`
  cursor: pointer;
  margin-left: ${props => props.hasBadge ? '6px' : '0'}
`

const TimeStamp = styled(RedText)`
  font-size: 14px;
  color: ${props => props.theme.Colors.grey};
`

const EditText = styled(RedText)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const CoverImage = styled.img`
  width: 100%;
  text-align: center;
  font-style: italic;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100vw;
  }
`

const CoverCaption = styled.p`
  width: 100%;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-style: italic;
  text-align: center;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme.Colors.bioGrey};
  letter-spacing: .2px;
  margin-top: 0px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const Container = styled.div`
  z-index: 500;
  margin: 65px auto 0;
  max-width: 800px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 15px auto;
    padding-left: 0;
    padding-right: 0;
  }
`

const ClickableContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 30px auto;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 30px 15px;
  }
`

const TopRow = styled(Row)`
  margin-bottom: 35px !important;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-bottom: 15px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
`

const PencilIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  margin-right: 5px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-right: 15px;
  }
`

const SpacedVerticalCenter = styled(VerticalCenter)`
  margin-left: 15px;
`

const ClickableRow = styled(Row)`
  cursor: pointer;
`

const BadgeIcon = styled(Icon)`
  margin-left: ${props => props.profileAvatar ? '0' : '10'}px;
  cursor: pointer;
`

const responsiveAvatarStyles = `
  width: 40px;
  height: 40px;
`

const ResponsiveButton = styled(RoundedButton)`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
  }
`

const followButtonStyles = `
  font-size: 10px;
  font-weight: 600;
`

const followButtonResponsiveStyles = `
  margin: 10px 0;
  font-size: 10px;
`

const hiddenFollowButttonResponsiveStyles = `
  display: none;
`

const addToGuideButtonStyles = `
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 4px;
`

const addToGuideButtonResponsiveStyles = `
  margin: 10px 0;
`

const addToGuideButtonResponsiveTextStyles = `
  font-size: 10px;
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
    shouldHideCover: PropTypes.bool,
    onClickAddToGuide: PropTypes.func,
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
    if (this.props.isStory) this.props.reroute(`/editStory/${this.props.feedItem.id}`)
    else this.props.reroute(`/edit/guide/${this.props.feedItem.id}`)
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
      shouldHideCover,
      onClickAddToGuide,
    } = this.props

    const mediaType = this.getMediaType()
    const hasBadge = author.role === 'contributor' || author.role === 'founding member'
    const isUsersFeedItem = author.id === sessionUserId

    return (
      <Container>
        <TopRow between="xs">
          <UserInfoRow>
            <Avatar
              avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
              size='medium'
              onClick={this._profileReroute}
              responsiveProps={responsiveAvatarStyles}
            />
            <SpacedVerticalCenter>
              <Row>
                <ClickableContainer
                  onClick={this._profileReroute}
                >
                  {hasBadge &&
                    <VerticalCenter>
                      <BadgeIcon
                        name={author.role === 'contributor' ? 'profileBadge' : 'founderBadge'}
                        size='mediumSmall'
                        profileAvatar={author.profile.avatar}
                      />
                    </VerticalCenter>
                  }
                  <Username
                    onClick={this._profileReroute}
                    hasBadge={hasBadge}
                  >
                    {author.username}
                  </Username>
                </ClickableContainer>
                {!isUsersFeedItem && sessionUserId &&
                  <SpacedVerticalCenter>
                    <RoundedButton
                      margin='none'
                      padding='smallEven'
                      onClick={isFollowing ? unfollowUser : followUser}
                      type={isFollowing ? undefined : 'blackWhite'}
                      text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                      textProps={followButtonStyles}
                      responsiveButtonProps={hiddenFollowButttonResponsiveStyles}
                    />
                  </SpacedVerticalCenter>
                }
              </Row>
              <TimeStamp>{moment(feedItem.createdAt).fromNow()}</TimeStamp>
            </SpacedVerticalCenter>
          </UserInfoRow>
          <Row>
            {isUsersFeedItem &&
              <VerticalCenter>
                <ClickableRow onClick={this._editReroute}>
                  <PencilIcon
                    name='pencilBlack'
                  />
                  <EditText>
                    Edit {isStory ? 'Story' : 'Guide'}
                  </EditText>
                </ClickableRow>
              </VerticalCenter>
            }
            {onClickAddToGuide && isUsersFeedItem &&
              <RoundedButton
                margin='noRight'
                padding='smallEven'
                text='Add To Guide'
                onClick={onClickAddToGuide}
                textProps={addToGuideButtonStyles}
                responsiveButtonProps={addToGuideButtonResponsiveStyles}
                responsiveTextProps={addToGuideButtonResponsiveTextStyles}
              />
            }
            {!isUsersFeedItem && sessionUserId &&
              <ResponsiveButton
              margin='none'
              padding='smallEven'
              onClick={isFollowing ? unfollowUser : followUser}
              type={isFollowing ? undefined : 'blackWhite'}
              text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
              textProps={followButtonStyles}
              responsiveButtonProps={followButtonResponsiveStyles}
              />
            }
          </Row>
        </TopRow>
        {!isStory &&
          <GuideTitle mediaType={mediaType}>{feedItem.title}</GuideTitle>
        }
        {
          mediaType === 'image' && !shouldHideCover &&
          <CoverImage
            src={this.getCoverImage()}
          />
        }
        {
          mediaType === 'video' && !shouldHideCover &&
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
        <StyledDivider
          color={'lighter-grey'}
        />
      </Container>
    )
  }
}
