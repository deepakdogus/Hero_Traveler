import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'

import UserActions, {getFollowers} from '../../Shared/Redux/Entities/Users'

import { WrappedNavLink } from '../../Components/NavLinkStyled'
import RoundedButton from '../../Components/RoundedButton'
import HorizontalDivider from '../../Components/HorizontalDivider'
// import SocialMediaRow from '../../Components/Signup/SocialMediaRow'
import FollowFollowingRow from '../../Components/FollowFollowingRow'

const Container = styled.div`
  margin: 0 7.5%;
  text-align: center;
`

const SocialContainer = styled.div`
  margin-bottom: 30px;
`

const NavLinkContainer = styled(SocialContainer)`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`

/*
Title and Subtitle are indentical in SignupSocial and SignupTopics
Possibly refactor into separate file or add styles to themes
*/
export const Title = styled.p`
  margin-top:0;
  font-weight: 400;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 35px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .6px;
  margin-bottom: 15px;
`

export const Subtitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .2px;
  margin-bottom: 30px;
`

const Section = styled.div`
  text-align: left;
  max-width: 1000px;
  margin: auto;
`

const SectionText = styled.h4`
  font-weight: 400;
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.background};
  letter-spacing: .6px;
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 10px 20px;
`
const LeftButtonStyleOverride = {
  marginBottom: '10px',
  marginLeft: '10px',
  marginRight: '5px',
  marginTop: '10px',
}

const RightButtonStyleOverride = {
  marginBottom: '10px',
  marginLeft: '5px',
  marginRight: '30px',
  marginTop: '10px',
}

class SignupSocial extends Component {
  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.object,
    suggestedUsersById: PropTypes.arrayOf(PropTypes.string),
    selectedUsersById: PropTypes.arrayOf(PropTypes.string),

    loadSuggestedPeople: PropTypes.func,
    loadUserFollowing: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  }

  componentDidMount() {
    this.props.loadSuggestedPeople()
    this.props.loadUserFollowing(this.props.user.id)
  }

  userIsSelected(user) {
    return _.includes(this.props.selectedUsersById, user.id)
  }

  _followUser = (userIdToFollow) => {
    this.props.followUser(this.props.user.id, userIdToFollow)
  }

  _unfollowUser = (userIdToUnfollow) => {
    this.props.unfollowUser(this.props.user.id, userIdToUnfollow)
  }

  renderSuggestedUsers() {
    const {suggestedUsersById, users} = this.props
    if (!suggestedUsersById || !users) return null
    const renderedSuggestions = suggestedUsersById.reduce((suggestions, key, index) => {
      const user = users[key]
      const isFollowing = this.userIsSelected(user)
      if (index !== 0) {
        suggestions.push((
          <HorizontalDivider
            key={`${key}-HR`}
            color='grey'
          />
        ))
      }
      suggestions.push((
        <FollowFollowingRow
          key={key}
          user={user}
          isFollowing={isFollowing}
          onFollowClick={isFollowing ? this._unfollowUser : this._followUser}
          margin='0 3%'
          type='count'
        />
      ))
      return suggestions
    }, [])

    return renderedSuggestions
  }

  render() {
    return (
      <SocialContainer>
        <NavLinkContainer>
          <WrappedNavLink
            to='/signup/topics'
            styles={LeftButtonStyleOverride}
          >
            <RoundedButton
              text='< Back'
              type="blackWhite"
              margin='none'

            />
          </WrappedNavLink>
          <WrappedNavLink
            to='/feed'
            styles={RightButtonStyleOverride}
            >
            <RoundedButton
              text='Finish'
              margin='none'
            />
          </WrappedNavLink>
        </NavLinkContainer>
        <Container>
        <Title>FOLLOW</Title>
          <Subtitle>We’ll add stories by people you follow to your custom reading list</Subtitle>
          {
          // disabled until further notice
          // <Section>
          //   <SectionText>FIND FRIENDS</SectionText>
          //   <SocialMediaRow text={'Facebook'} isConnected={true} />
          //   <HorizontalDivider color='grey'/>
          //   <SocialMediaRow text={'Twitter'} isConnected={false} />
          //   <HorizontalDivider color='grey'/>
          //   <SocialMediaRow text={'Instagram'} isConnected={false} />
          // </Section>
          }
          <Section>
            <SectionText>SUGGESTED PEOPLE</SectionText>
            {this.renderSuggestedUsers()}
          </Section>
        </Container>
      </SocialContainer>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.entities.users.entities
  const user = users[state.session.userId]
  return {
    user,
    users,
    suggestedUsersById: state.entities.users.suggestedUsersById,
    selectedUsersById: getFollowers(state.entities.users, 'following', user.id),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadSuggestedPeople: () => dispatch(UserActions.loadUserSuggestionsRequest()),
    loadUserFollowing: (userId) => dispatch(UserActions.loadUserFollowing(userId)),
    followUser: (sessionUserID, userIdToFollow) => dispatch(UserActions.followUser(sessionUserID, userIdToFollow)),
    unfollowUser: (sessionUserID, userIdToUnfollow) => dispatch(UserActions.unfollowUser(sessionUserID, userIdToUnfollow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupSocial)
