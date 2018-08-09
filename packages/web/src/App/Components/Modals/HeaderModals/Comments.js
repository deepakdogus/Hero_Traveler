import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CommentActions from '../../../Shared/Redux/Entities/Comments'

import MessageRow from '../../MessageRow'
import InputRow from '../../InputRow'
import {RightTitle, RightModalCloseX} from '../Shared'

const Container = styled.div`
  position: relative;
  padding-bottom: 92px;
`

class Comments extends Component {
  static PropTypes = {
    closeModal: PropTypes.func,
    sessionUserId: PropTypes.string,
    users: PropTypes.object,
    storyId: PropTypes.string,
    guideId: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.object),
    getCommentsStatus: PropTypes.object,
    createCommentStatus: PropTypes.object,
    error: PropTypes.string,
    getComments: PropTypes.func,
    createComment: PropTypes.func,
  }

  componentDidMount() {
    const {storyId, guideId, getComments} = this.props
    storyId
    ? getComments(storyId, 'story')
    : getComments(guideId, 'guide')
  }

  _createComment = (text) => {
    const {storyId, guideId, createComment} = this.props
    storyId
    ? createComment(storyId, 'story', text)
    : createComment(guideId, 'guide', text)
  }

  setBottomDivRef = (ref) => this.bottomDivRef = ref

  renderUserMessageRows(comments) {
    return comments.map((comment, index) => {
      let user
      if (typeof comment.user === 'string') user = this.props.users[comment.user]
      else user = comment.user
      return (
        <MessageRow
          key={comment.id}
          index={index}
          user={user}
          message={comment.content}
          timestamp={new Date(comment.createdAt)}
          padding='10px 30px'
          isComment={true}
        />
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    const {storyId, comments} = this.props
    const entityType = storyId ? 'story' : 'guide'
    if (
      nextProps.comments[entityType].length - comments[entityType].length === 0
      && this.bottomDivRef)
    {
      this.bottomDivRef.scrollIntoView({ behavior: "smooth" })
    }
  }

  render() {
    let {
      comments,
      storyId,
      guideId,
      createCommentStatus,
      error,
      closeModal,
      sessionUserId,
    } = this.props

    storyId
    ? comments = comments['story'][storyId]
    : comments = comments['guide'][guideId]

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={closeModal}/>
        <RightTitle>COMMENTS</RightTitle>
        {comments && this.renderUserMessageRows(comments)}
        {sessionUserId &&
          <InputRow
            onClick={this._createComment}
            handlingSubmit={createCommentStatus.creating && !error}
          />
        }
        <div ref={this.setBottomDivRef}/>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  const sessionUserId = state.session.userId
  return {
    ...state.entities.comments,
    sessionUserId,
    users: state.entities.users.entities,
    comments: state.entities.comments
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getComments: (feedItemId, entityType) => dispatch(CommentActions.getCommentsRequest(feedItemId, entityType)),
    createComment: (feedItemId, entityType, text) => dispatch(CommentActions.createCommentRequest(feedItemId, entityType, text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
