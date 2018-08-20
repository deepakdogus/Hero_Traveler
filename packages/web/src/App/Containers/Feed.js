import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import StoryList from '../Components/StoryList'
import FeedHeader from '../Components/FeedHeader'
import StoryActions from '../Shared/Redux/Entities/Stories'
import SignUpActions from '../Shared/Redux/SignupRedux'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'
import HorizontalDivider from '../Components/HorizontalDivider'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 1.5px;
  padding: 30px 0 0 0;
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
`

const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  border-width: 1px;
  margin-bottom: 23px;
`

class Feed extends Component {

  static propTypes = {
    userId: PropTypes.string,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    stories: PropTypes.objectOf(PropTypes.object),
    users: PropTypes.objectOf(PropTypes.object),
    attemptGetUserFeed: PropTypes.func,
    signedUp: PropTypes.bool,
  }

  componentDidMount(){
    //get user feed on signUp and reset signUp redux
    if (this.props.signedUp) {
      this.props.attemptGetUserFeed(this.props.userId)
      this.props.signupReset()
    }
  }

  render() {
    const {stories, users, storiesById} = this.props
    const feedStories = storiesById.map((id) => {
      return stories[id]
    })

    return (
      <Wrapper>
        <FeedHeader stories={feedStories} users={users}/>
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StyledDivider />
          <StoryList
            stories={feedStories}
            users={users}
          />
          <ShowMore/>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  let { userFeedById, entities: stories } = state.entities.stories

  return {
    userId: state.session.userId,
    storiesById: userFeedById,
    stories,
    users: state.entities.users.entities,
    signedUp: state.signup.signedUp,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    signupReset: () => dispatch(SignUpActions.signupReset())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
