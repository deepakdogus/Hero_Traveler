import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import StoryCommentsActions from '../../Shared/Redux/Entities/StoryComments'

import MessageRow from '../MessageRow'
import InputRow from '../InputRow'
import {RightTitle, RightModalCloseX} from './Shared'

const Container = styled.div`
  position: relative;
  padding-bottom: 92px;
`

class Comments extends Component {
  static PropTypes = {
    closeModal: PropTypes.func,
    sessionUserId: PropTypes.string,
    users: PropTypes.object,
    comments: PropTypes.arrayOf(PropTypes.object),
    getCommentsStatus: PropTypes.object,
    createCommentStatus: PropTypes.object,
    error: PropTypes.string,
    getComments: PropTypes.func,
    createComment: PropTypes.func,
  }

  componentDidMount() {
    this.props.getComments()
  }

  _createComment = (text) => {
    this.props.createComment(text)
  }

  setBottomDivRef = (ref) => this.BottomDiv = ref

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
    if (nextProps.comments.length - this.props.comments.length === 0 && this.BottomDiv) {
      this.BottomDiv.scrollIntoView({ behavior: "smooth" })
    }
  }

  render() {
    const {comments} = this.props

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>COMMENTS</RightTitle>
        {this.renderUserMessageRows(comments)}
        {this.props.sessionUserId &&
          <InputRow
            onClick={this._createComment}
            handlingSubmit={this.props.createCommentStatus.creating && !this.props.error}
          />
        }
        <div ref={this.setBottomDivRef}/>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const sessionUserId = state.session.userId
  return {
    ...state.entities.storyComments,
    sessionUserId,
    users: state.entities.users.entities,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getComments: () => dispatch(StoryCommentsActions.getCommentsRequest(ownProps.storyId)),
    createComment: (text) => dispatch(StoryCommentsActions.createCommentRequest(ownProps.storyId, text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
