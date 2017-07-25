import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import getImageUrl from '../Shared/Lib/getImageUrl'
import getVideoUrl from '../Shared/Lib/getVideoUrl'

import Avatar from './Avatar'
import Header from './Header'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import {Row} from './FlexboxGrid';
import HorizontalDivider from './HorizontalDivider'
import Video from './Video'


const Username = styled.p`
  font-weight: 400;
  font-size: 30px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`

const ItalicText = styled.p`
  font-weight: 400;
  font-size: 18px;
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
  width: 72px;
  border-width: 1px 0 0 0;
`

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
`

export default class StoryHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }

  render () {
    const {user} = this.props
    return (
      <HeaderImageWrapper
        size='fullScreen'
        type='profile'
      >
        <Header isLoggedIn></Header>
        <Centered>
          <VerticalCenter>
            <Username>{user.username}</Username>
            <StyledHorizontalDivider />
            <ItalicText>{user.profile.fullName}</ItalicText>
            <div style={{margin: 'auto'}}>
              <StyledAvatar type='profile' size='x-large' />
            </div>
          </VerticalCenter>
        </Centered>
      </HeaderImageWrapper>
    )
  }
}
