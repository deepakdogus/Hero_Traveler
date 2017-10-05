import React, { Component } from 'react'
import styled from 'styled-components'

import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchResultsStories from '../Components/SearchResultsStories'
import Header from '../Components/Header'
import Togglebar from '../Components/Togglebar'
import {Row} from '../Components/FlexboxGrid'

import {feedExample, usersExample} from './Feed_TEST_DATA'

const Container = styled.div`
  margin-top: 65px;
`

const HeaderInputContainer = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 0 30px;
`

const HeaderInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  height: 120px;
  width: 80%;
  background-color: transparent;
  font-weight: 400;
  font-size: 30px;
  border: none;
  outline: none;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.signupGrey};
  &::placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &::-moz-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &:-ms-input-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
  &:-moz-placeholder{
    color: ${props => props.theme.Colors.signupGrey};
  };
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const StyledTogglebar = styled(Togglebar)`
  background-color: ${props => props.theme.Colors.clear}
`

const Text = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.redHighlights};
  text-align: 'right';
  margin: 0;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  line-height: 122px;
  letter-spacing: .7px;
`

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'stories',
    }
  }

  // sloppy fix for onClick - need to create more abstract version
  toggleSearchResultTabs = () => {
    let tabToActivate
    if (this.state.activeTab === 'stories') tabToActivate = 'people'
    else tabToActivate = 'stories'
    this.setState({activeTab: tabToActivate})
  }

  renderActiveTab = () => {
    if (this.state.activeTab === 'people') {
      return (
        <SearchResultsPeople
          userSearchResults={usersExample}
        />
      )
    }
    else {
      return (
        <SearchResultsStories
          storySearchResults={feedExample}
          userSearchResults={usersExample}
        />
      )
    }
  }

  render() {
    const togglebarTabs = [
      { text: 'stories', isActive: this.state.activeTab === 'stories' },
      { text: 'people', isActive: this.state.activeTab === 'people' },
    ]
    return (
      <Container>
        <Header blackHeader={true} isLoggedIn></Header>
        <HeaderInputContainer between='xs'>
          <HeaderInput placeholder='Type to search' />
          <Text>Cancel</Text>
        </HeaderInputContainer>
        <ContentWrapper>
          <StyledTogglebar
            tabs={togglebarTabs}
            isClear={true}
            onClickTab={this.toggleSearchResultTabs}
          />
          {this.renderActiveTab()}
        </ContentWrapper>
      </Container>
    )
  }
}
