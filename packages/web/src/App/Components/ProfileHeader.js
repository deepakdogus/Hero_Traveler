import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Avatar from './Avatar'
import Header from './Header'
import {Row} from './FlexboxGrid'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'

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

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 630px;
  top:0;
  text-align:center;
  z-index: 1;
`

const Count = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 23px;
  color ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
`

const CountLabel = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.lightGrey};
  letter-spacing: 1.5px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
`

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
`

const AvatarWrapper = styled.div`
  margin: 25px 0;
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin: 0 20px;
`

const CountWrapper = styled(Row)`
  margin-top: 25px !important;
`

const CountItemWrapper = styled.div``

const ButtonWrapper = styled.div`
  margin-top: 25px;
`


export default class StoryHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }

  render () {
    const {user} = this.props
    return (
      <HeaderImageWrapper
        size='large'
        type='profile'
      >
        <Header isLoggedIn></Header>
        <Centered>
          <VerticalCenter>
            <Username>{user.username}</Username>
            <StyledHorizontalDivider />
            <ItalicText>{user.profile.fullName}</ItalicText>
            <AvatarWrapper>
              <StyledAvatar type='profile' size='x-large' />
            </AvatarWrapper>
            <ItalicText>Read Bio</ItalicText>
            <CountWrapper center='xs'>
              <CountItemWrapper>
                <Count>{user.counts.followers}</Count>
                <CountLabel>Followers</CountLabel>
              </CountItemWrapper>
              <Divider/>
              <CountItemWrapper>
                <Count>{user.counts.following}</Count>
                <CountLabel>Following</CountLabel>
              </CountItemWrapper>
            </CountWrapper>
            <ButtonWrapper>
              <RoundedButton type='opaque' text='EDIT PROFILE'/>
            </ButtonWrapper>
          </VerticalCenter>
        </Centered>
      </HeaderImageWrapper>
    )
  }
}
