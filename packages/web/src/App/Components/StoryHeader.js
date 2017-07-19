import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import getImageUrl from '../Shared/Lib/getImageUrl'

import Avatar from './Avatar'
import Header from './Header'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import {Row} from './FlexboxGrid';
import HorizontalDivider from './HorizontalDivider'

const Title = styled.p`
  font-weight: 400;
  font-size: 65px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`

const Subtitle = styled.p`
  font-weight: 400;
  font-size: 23px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
`

const BottomContainer = styled(Row)`
  position: absolute;
  bottom: 0;
  width: 100%;
`

const AuthorTime = styled.div`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .7px;
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top:0;
  text-align:center;
  z-index: 1;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 65px;
  border-width: 1px 0 0 0;
`

export default class StoryHeader extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
  }

  render () {
    const {story, author} = this.props
    return (
      <HeaderImageWrapper
        backgroundImage={getImageUrl(story.coverImage)}
        size='fullScreen'
      >
        <Header isLoggedIn></Header>
        <Centered>
          <VerticalCenter>
            <Title>{story.title}</Title>
            <StyledHorizontalDivider />
            <Subtitle>{story.description}</Subtitle>
          </VerticalCenter>
        </Centered>
        <BottomContainer center="xs">
          <Avatar
            avatarUrl={getImageUrl(author.profile.avatar)}
            size='medium'
          />
          <VerticalCenter>
            <AuthorTime>By {author.username} | {moment(story.createdAt).format('MMMM Do YYYY')}</AuthorTime>
            <p style={{color: 'white'}}>DOWN ARROW</p>
          </VerticalCenter>
        </BottomContainer>
      </HeaderImageWrapper>
    )
  }
}
