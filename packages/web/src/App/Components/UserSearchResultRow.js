import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import RoundedButton from './RoundedButton'
import HorizontalDivider from './HorizontalDivider'


const Container = styled.div`
`

const UserContainer = styled(Container)`
  padding: 20px 0px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

export const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`

export const UserName = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 0;
`

const Name = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const TopSpacer = styled.div`
  margin-top: 34px;
`

export default class UserSearchResultRow extends Component {
  static propTypes = {
    user: PropTypes.object,
    margin: PropTypes.string,
    index: PropTypes.number,
  }

  renderImage = () => {
    return (
      <Avatar
        avatarUrl={getImageUrl(this.props.user.profile.avatar)}
        size='larger'
      />
    )
  }

  renderText = () => {
    const {user} = this.props
    return (
      <StyledVerticalCenter>
        <UserName>{user.username}</UserName>
        <Name>Name</Name>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text='+ FOLLOW'
          type='blackWhite'
          margin='none'
          width='138px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        {this.props.index < 1 ? <TopSpacer/> : <StyledHorizontalDivider color='light-grey'/>}
        <UserContainer margin={this.props.margin}>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </UserContainer>
      </Container>
    )
  }
}
