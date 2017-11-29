import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import PropTypes from 'prop-types'
import moment from 'moment'

import {isStoryLiked, isStoryBookmarked} from '../Shared/Redux/Entities/Users'
import UserActions, {getFollowers} from '../Shared/Redux/Entities/Users'
import StoryActions from '../Shared/Redux/Entities/Stories'

import Avatar from './Avatar'
import LikeComponent from './LikeComponent'
import {Row} from './FlexboxGrid'
import NavLinkStyled from './NavLinkStyled'
import VerticalCenter from './VerticalCenter'

import getImageUrl from '../Shared/Lib/getImageUrl'
import formatCount from '../Shared/Lib/formatCount'

const coverHeight = '257px'

const StoryLink = styled(NavLinkStyled)``

const ProfileLink = styled(StoryLink)`
  display: flex;
`

const MarginWrapper = styled.div`
  position: relative;
  max-width: 960px;
  margin: auto;
  color: ${props => props.theme.Colors.lightGrey};
`

const StoryInfoContainer = styled(VerticalCenter)`
  position: relative;
  height: ${coverHeight};
  margin-left: 20px;
`

const Title = styled.h3`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 23px;
  color: ${props => props.theme.Colors.background};
  display: inline-block;
  margin: 0 0 10px;
  cursor: pointer;
`

const DetailsContainer = styled(Row)`
  display: flex;
  position: relative;
`

const CoverImage = styled.img`
  width: 385.5px;
  height: ${coverHeight};
  object-fit: cover;
  cursor: pointer;
`

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 15px;
  color: ${props => props.theme.Colors.grey};
`

const ByText = styled(Text)`
  margin-left: 7.5px;
`

const Username = styled(Text)`
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;

`

const BottomLeft = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`

class StoryPreview extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    reroute: PropTypes.func,
  }

  navToStory = () => {
    this.props.reroute(`/story/${this.props.story.id}`)
  }

  navToUserProfile = () => {
    this.props.reroute(`/profile/${this.props.author.id}/view`)
  }

  _onPressLike = () => {
    const {sessionUserId, onPressLike} = this.props
    onPressLike(sessionUserId)
  }

  _onPressBookmark = () => {
    const {sessionUserId, onPressBookmark} = this.props
    onPressBookmark(sessionUserId)
  }

  render() {
    const {story, author} = this.props
    let imageUrl;
    if (story.coverImage) imageUrl = getImageUrl(story.coverImage)
    else if (story.coverVideo) imageUrl = getImageUrl(story.coverVideo, 'video')

    if (!story || !author) return

    return (
      <MarginWrapper>
        <Row>
          <CoverImage
            src={imageUrl}
            onClick={this.navToStory}
          />
          <StoryInfoContainer>
            <Title onClick={this.navToStory}>{story.title}</Title>
            <DetailsContainer between='xs'>
              <Row middle='xs'>
                <Avatar
                  avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                  size='avatar'
                  onClick={this.navToUserProfile}
                />
                <ByText>By&nbsp;</ByText>
                <Username onClick={this.navToUserProfile}>{author.username}</Username>
                <Text>, {moment(story.createdAt).fromNow()}</Text>
              </Row>
            </DetailsContainer>
            <BottomLeft>
              <LikeComponent
                likes={formatCount(story.counts.likes)}
                isLiked={this.props.isLiked}
                horizontal
              />
            </BottomLeft>
          </StoryInfoContainer>
        </Row>
      </MarginWrapper>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const {session, entities} = state
  const sessionUserId = session.userId
  const {story} = ownProps

  let storyProps = null
  if (story) {
    storyProps = {
      author: entities.users.entities[story.author],
      isLiked: isStoryLiked(entities.users, sessionUserId, story.id),
      isBookmarked: isStoryBookmarked(entities.users, sessionUserId, story.id),
    }
  }

  return {
    sessionUserId: state.session.userId,
    ...storyProps,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const {story} = props
  return {
    onPressLike: (sessionUserId) => dispatch(StoryActions.storyLike(sessionUserId, story.id)),
    onPressBookmark: (sessionUserId) => dispatch(StoryActions.storyBookmark(sessionUserId, story.id)),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryPreview)

