import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import SpaceBetweenRowWithTimeStamp from './SpaceBetweenRowWithTimeStamp'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
import HorizontalDivider from './HorizontalDivider'
import {
  StyledVerticalCenter,
  UserName,
  CommentContent,
  Timestamp,
} from './Modals/Shared'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
  padding: ${props => props.padding ? props.padding : '0'}
`

const CommentContainer = styled.div`
  margin-left: 28px;
  margin-top: 14px;
`

const TimeStampContainer = styled.div`

`

export default class CommentRow extends Component {
  static propTypes = {
    comment: PropTypes.string,
    user: PropTypes.object,
    key: PropTypes.string,
    index: PropTypes.num,
    timestamp: PropTypes.func,
    margin: PropTypes.string,
    padding: PropTypes.string,
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
    const commentText = this.props.comment ? this.props.comment : 'Lorum Ipsum'
    return (
      <CommentContainer>
        <UserName>{user.username}</UserName>
        <CommentContent>{commentText}</CommentContent>
      </CommentContainer>
    )
  }


  renderTimestamp = () => {
    return (
      <TimeStampContainer>
        <Timestamp margin='none' width='50px' >{moment(this.props.timestamp).fromNow()}</Timestamp>
      </TimeStampContainer>
    )
  }

  render() {
    return (
        <Container>
        {this.props.index > 0 ? <HorizontalDivider color='light-grey'/> : null}
          <Container padding={this.props.padding} margin={this.props.margin}>
            <SpaceBetweenRowWithTimeStamp
              renderImage={this.renderImage}
              renderText={this.renderText}
              renderTimestamp={this.renderTimestamp}
            />
          </Container>          
        </Container>
    )
  }
}
