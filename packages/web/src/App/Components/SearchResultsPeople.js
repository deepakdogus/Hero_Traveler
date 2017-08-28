import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Togglebar from './Togglebar'
import UserSearchResultRow from './UserSearchResultRow'



const togglebarTabs = [
  { text: 'stories', isActive: false },
  { text: 'people', isActive: true },
]

const StyledTogglebar = styled(Togglebar)`
  background-color: ${props => props.theme.Colors.clear}
`

const Container = styled.div``

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export default class SearchResultsPeople extends Component {
  static PropTypes = {
    toggleSearchResultTabs: PropTypes.func,
    userSearchResults: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const users = this.props.userSearchResults;

    
    
    const renderedUsers = Object.keys(users).map((key, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      const user = users[key]

      if (index >= 4) return null
      return (
        <UserSearchResultRow
          user={user}
          username={user.username}
          key={key}
          index={index}
        />
      )
    })



    return (
      <Container>
        <ContentWrapper>
          <StyledTogglebar 
            tabs={togglebarTabs}
            isClear={true}
            onClick={this.props.toggleSearchResultTabs}
          />

          {renderedUsers}


        </ContentWrapper>

      </Container>
    )
  }
}

