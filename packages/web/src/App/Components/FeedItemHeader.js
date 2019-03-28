import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import getImageUrl from '../Shared/Lib/getImageUrl'
import { getVideoUrls } from '../Shared/Lib/getVideoUrl'

import Avatar from './Avatar'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import { Row } from './FlexboxGrid'
import Video from './Video'
import RoundedButton from './RoundedButton'
import Icon from './Icon'
import StarRating from './CreateStory/StarRating'

import { displayLocationPreview } from '../Shared/Lib/locationHelpers'
import { showPublishDate } from '../Shared/Lib/dateHelpers'
import { roleToIconName, hasBadge } from '../Shared/Lib/badgeHelpers'

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
  letter-spacing: 0.6px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 20px;
    padding-right: 20px;
    font-size: 30px;
  }
`

const GuideTitle = styled(Title)`
  margin-bottom: 35px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 30px;
  }
`

const Subtitle = styled.p`
  margin: 7.5px 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.2px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
    padding-left: 20px;
    padding-right: 20px;
  }
`

const OverallExperience = styled.div`
  display: flex;
`

const OverallExperienceText = styled.p`
  margin: 3px 10px 0 0;
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.7px;
`

const LocationText = styled(Subtitle)`
  margin-top: 45px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  text-transform: uppercase;
  font-weight: 600;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 15px;
    margin-top: 30px;
  }
`

const RedText = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: 0.2px;
`

const Username = styled(RedText)`
  cursor: pointer;
  margin-left: ${props => (props.hasBadge ? '6px' : '0')};
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
  letter-spacing: 0.2px;
  margin: 20px 0 0 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const Container = styled.div`
  z-index: 500;
  margin: 65px auto 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0 auto;
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
    margin: 30px 20px;
  }
`

const TopRow = styled(Row)`
  margin-bottom: 35px !important;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-top: 15px !important;
    margin-bottom: 15px !important;
    padding-left: 20px;
    padding-right: 20px;
  }
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
  cursor: pointer;
`

const responsiveAvatarStyles = `
  width: 40px;
  height: 40px;
`

const followButtonTextStyles = `
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
`

const responsiveFollowButtonStyles = `
  display: block;
  margin: 10px 0;
  font-size: 10px;
`

const hideButtonStyles = `
  display: none;
`

const addToGuideButtonStyles = `
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
  margin-bottom: 4px;
  cursor: pointer;
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
    isDraft: PropTypes.bool,
    shouldHideCover: PropTypes.bool,
    onClickAddToGuide: PropTypes.func,
  }

  getMediaType() {
    const { feedItem } = this.props
    if (feedItem.coverVideo && !feedItem.coverImage) return 'video'
    if (feedItem.coverImage) return 'image'
    return undefined
  }

  getCoverImage() {
    const { feedItem } = this.props
    if (this.getMediaType() === 'video') {
      return getImageUrl(feedItem.coverVideo, 'video')
    }
    return getImageUrl(feedItem.coverImage)
  }

  _onClickAddToGuide = () => {
    this.props.onClickAddToGuide(this.props.sessionUserId)
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
      isDraft,
      shouldHideCover,
      onClickAddToGuide,
    } = this.props

    const mediaType = this.getMediaType()
    const isUsersFeedItem = author.id === sessionUserId

    return (
      <Container>
        <TopRow between="xs">
          <UserInfoRow>
            <Avatar
              avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
              size="medium"
              type="profile"
              onClick={this._profileReroute}
              responsiveProps={responsiveAvatarStyles}
            />
            <SpacedVerticalCenter>
              <Row>
                <ClickableContainer onClick={this._profileReroute}>
                  {hasBadge(author.role) && (
                    <VerticalCenter>
                      <BadgeIcon
                        name={roleToIconName[author.role]}
                        size="mediumSmall"
                        profileAvatar={author.profile.avatar}
                      />
                    </VerticalCenter>
                  )}
                  <Username
                    onClick={this._profileReroute}
                    hasBadge={hasBadge(author.role)}
                  >
                    {author.username}
                  </Username>
                </ClickableContainer>
                {!isUsersFeedItem && (
                  <SpacedVerticalCenter>
                    <RoundedButton
                      margin="none"
                      padding="smallEven"
                      onClick={isFollowing ? unfollowUser : followUser}
                      type={isFollowing ? undefined : 'blackWhite'}
                      text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                      textProps={followButtonTextStyles}
                      responsiveButtonProps={hideButtonStyles}
                    />
                  </SpacedVerticalCenter>
                )}
              </Row>
              <TimeStamp>{showPublishDate(feedItem)}</TimeStamp>
            </SpacedVerticalCenter>
          </UserInfoRow>
          <Row>
            {isUsersFeedItem && (
              <VerticalCenter>
                <ClickableRow onClick={this._editReroute}>
                  <PencilIcon name="pencilBlack" />
                  <EditText>Edit {isStory ? 'Story' : 'Guide'}</EditText>
                </ClickableRow>
              </VerticalCenter>
            )}
            {onClickAddToGuide && !isDraft && (
              <RoundedButton
                margin="noRight"
                padding="smallEven"
                text="Add To Guide"
                onClick={this._onClickAddToGuide}
                textProps={addToGuideButtonStyles}
                responsiveButtonProps={hideButtonStyles}
              />
            )}
            {!isUsersFeedItem && sessionUserId && (
              <RoundedButton
                margin="none"
                padding="smallEven"
                onClick={isFollowing ? unfollowUser : followUser}
                type={isFollowing ? undefined : 'blackWhite'}
                text={isFollowing ? 'FOLLOWING' : '+ FOLLOW'}
                textProps={followButtonTextStyles}
                buttonProps={hideButtonStyles}
                responsiveButtonProps={responsiveFollowButtonStyles}
              />
            )}
          </Row>
        </TopRow>
        {!isStory && <GuideTitle mediaType={mediaType}>{feedItem.title}</GuideTitle>}
        {mediaType === 'image' && !shouldHideCover && <CoverImage src={this.getCoverImage()} />}
        {mediaType === 'video' && !shouldHideCover && (
          <Video
            {...getVideoUrls(feedItem.coverVideo, false)}
            type="cover"
            withPrettyControls
          />
        )}
        {isStory && (
          <div>
            <CoverCaption>{feedItem.coverCaption}</CoverCaption>
            <LocationText>{displayLocationPreview(feedItem.locationInfo)}</LocationText>
            <Title mediaType={mediaType}>{feedItem.title}</Title>
            <Subtitle>{feedItem.description}</Subtitle>
            {feedItem.rating && (
              <OverallExperience>
                <OverallExperienceText>Overall Experience:</OverallExperienceText>
                <StarRating valueSelected={feedItem.rating} />
              </OverallExperience>
            )}
          </div>
        )}
        {isStory && <StyledDivider color={'lighter-grey'} />}
      </Container>
    )
  }
}
