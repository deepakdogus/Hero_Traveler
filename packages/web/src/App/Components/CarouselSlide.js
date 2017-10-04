import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import getImageUrl from '../Shared/Lib/getImageUrl'

import Avatar from './Avatar'
import RoundedButton from './RoundedButton'
import VerticalCenter from './VerticalCenter'
import {Row} from './FlexboxGrid';
import HorizontalDivider from './HorizontalDivider'
import Video from './Video'
import NavLinkStyled from './NavLinkStyled'

const ProfileLink = styled(NavLinkStyled)``

const Title = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 59px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
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
  margin: 6px 0 10px 0;
`

const BottomContainer = styled(Row)`
  position: absolute;
  bottom: 12px;
  width: 100%;
  z-index: 1;
`

const Author = styled.span`
  color: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .7px;
  display: inline-block;
`

const Time = styled.span`
  color: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .7px;
  display: inline-block;
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top:0;
  text-align:center;
  z-index: 100;
`

const StyledVerticalCenter = styled(VerticalCenter)`
  margin-top: -60px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
  border-color: ${props => props.theme.Colors.whiteAlphaPt4};
`

const StyledRoundedButton = styled(RoundedButton)`
  border: 2px solid white;
  align-self: center;
  margin: 25px;
  letter-spacing: 1.5px;
  outline: none;
`

const StyledVideo = styled(Video)`
  height: 570px;
  position: relative;
  z-index: -1;
`

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin-left: 10px;
  margin-right: 10px;
`

export default class FeedHeader extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,

  }

  getMediaCover(story) {
    if (story.coverVideo) {
      return (
        <StyledVideo
          // src={getVideoUrl(story.coverVideo)}
          type='preview'
          noControls={true}
        />
      )
    }
    else {
      return (
         <img
          src={getImageUrl(story.coverImage)}
          alt='HeroCover'
          height='570px'
          width='100%'
        />
      )
    }
  }

  render () {
    const {story, author} = this.props
    const Cover = this.getMediaCover(story)
    return (
      <div>
        {Cover}
        <Centered>
          <StyledVerticalCenter>
            <Title mediaType='image'>{story.title}</Title>
            <StyledHorizontalDivider />
            <Subtitle>{story.description || 'Best Trip Ever'}</Subtitle>
            <StyledRoundedButton
              type='myFeedHeaderButton'
              padding='even'
              text='READ MORE'
              width='168px'
              height='50px'
            />
          </StyledVerticalCenter>
        </Centered>
        <BottomContainer center="xs">
          <ProfileLink to={`/profile/${author.id}`}>
            <Avatar
              avatarUrl={getImageUrl(author.profile.avatar)}
              size='medium'
            />
          </ProfileLink>
          <VerticalCenter>
            <Row middle='xs'>
              <Author>&nbsp;&nbsp;By {author.username}</Author>
              <Divider>&nbsp;</Divider>
              <Time>{moment(story.createdAt).format('MMMM Do YYYY')}</Time>
            </Row>
          </VerticalCenter>
        </BottomContainer>
      </div>
    )
  }
}
