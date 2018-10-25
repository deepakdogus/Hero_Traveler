import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import { NavLink } from 'react-router-dom'

import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'

import Avatar from './Avatar'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter, {VerticalCenterStyles} from './VerticalCenter'
import { Row } from './FlexboxGrid';
import HorizontalDivider from './HorizontalDivider'
import Video from './Video'
import { NavLinkStyled } from './NavLinkStyled'
import RotatedArrow from './RotatedArrow'
import RoundedButton from './RoundedButton'

const ProfileLink = styled(NavLinkStyled)`
  ${VerticalCenterStyles}
`

const Title = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: ${props => {
    if (props.isPreview) return '59px'
    return props.mediaType === 'video' ? '30px' : '65px'
  }};
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .6px;
  text-transform: uppercase;
  margin: 0;
`

const Subtitle = styled.p`
  font-family: ${props => props.theme.Fonts.type.crimsonText};
  font-weight: 400;
  font-size: 23px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0 0 10px 0;
`

const BottomContainer = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  z-index: 1;
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 570px;
  top:0;
  text-align:center;
  z-index: 1;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 65px;
  border-width: 1px 0 0 0;
  border-color: ${props => props.theme.Colors.whiteAlphaPt4};
`

const DownArrow = styled(RotatedArrow)``

const StyledRoundedButton = styled(RoundedButton)`
  align-self: center;
`

const StoryInfo = styled.span`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .7px;
  display: inline-block;
`

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin-left: 7.5px;
  margin-right: 7.5px;
  margin-top: 1.5px;
  height: 20px;
`

const StoryInfoRow = styled(Row)`
  padding-left: 5px;
`

const videoThumbnailOptions = {
  video: true,
  width: 'screen',
}

export default class HeaderSlide extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    isPreview: PropTypes.bool,
  }

  getMediaType() {
    const {story} = this.props
    if (story.coverVideo && !story.coverImage) return 'video'
    if (story.coverImage) return 'image'
    return undefined
  }

  getCoverImage() {
    const {story, isPreview} = this.props
    if (isPreview && this.getMediaType() === 'video') {
      return getImageUrl(story.coverVideo, 'optimized', videoThumbnailOptions)
    }
    return getImageUrl(story.coverImage)
  }

  render () {
    const {story, author, isPreview} = this.props
    const mediaType = this.getMediaType()

    return (
      <HeaderImageWrapper
        backgroundImage={this.getCoverImage()}
        size={isPreview ? 'preview' : 'fullScreen'}
        type='story'
      >
        <Centered>
          <Title mediaType={mediaType} isPreview={isPreview}>{story.title}</Title>
          <StyledHorizontalDivider />
          <Subtitle>{story.description}</Subtitle>
          {isPreview &&
           <NavLink
               to={`/story/${story.id}`}
           >
            <StyledRoundedButton
              padding='even'
              text='READ MORE'
              width='168px'
              height='50px'
            />
           </NavLink>
          }
          {!isPreview && mediaType === 'video' &&
            <Video src={getVideoUrl(story.coverVideo, false)} type='cover'/>
          }
        </Centered>
        <BottomContainer>
          <Row center='xs'>
            <ProfileLink to={`/profile/${author.id}/view`}>
              <Avatar
                avatarUrl={getImageUrl(author.profile.avatar, 'avatar')}
                size='extraMedium'
              />
            </ProfileLink>
            <VerticalCenter>
              <StoryInfoRow>
                <StoryInfo>By{' '}
                  <NavLinkStyled to={`/profile/${author.id}/view`}>
                  {author.username}
                  </NavLinkStyled>
                </StoryInfo>
                <Divider>&nbsp;</Divider>
                <StoryInfo>{moment(story.createdAt).format('MMMM Do YYYY')}</StoryInfo>
              </StoryInfoRow>
            </VerticalCenter>
          </Row>
          {!isPreview &&
            <Row center='xs'>
              <DownArrow name='arrowRight'/>
            </Row>
          }
        </BottomContainer>
      </HeaderImageWrapper>
    )
  }
}
