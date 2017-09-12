import React, { Component } from 'react'
import styled from 'styled-components'

import TextButton from '../Components/TextButton'
import SearchResultsPeople from '../Components/SearchResultsPeople'
import SearchResultsStories from '../Components/SearchResultsStories'
import Header from '../Components/Header'

import {feedExample, usersExample} from './Feed_TEST_DATA'

const Container = styled.div``

const HeaderInputContainer = styled(Container)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
`

const HeaderInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  height: 120px;
  width: 80%;
  background-color: transparent;
  font-weight: 400;
  font-size: 30px;
  padding-left: 30px;
  margin-top: 65px;
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

const StyledTextButton = styled(TextButton)`
  position: absolute;
  right: 40px;
  top: 113px;
  outline: none;
`

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {showPeopleResults: false}
  }

  toggleSearchResultTabs = () => {
    this.setState({showPeopleResults: !this.state.showPeopleResults})
  }

  render() {
    return (
      <Container>
        <Header blackHeader={true} isLoggedIn></Header>
        <HeaderInputContainer>
          <HeaderInput placeholder='Type to search' />
          <StyledTextButton 
            textAlign='right'
            margin='none'
            text='Cancel'
          />
        </HeaderInputContainer>
        <ContentWrapper>
        {this.state.showPeopleResults
        ? <SearchResultsPeople userSearchResults={usersExample} toggleSearchResultTabs={this.toggleSearchResultTabs}/>
        : <SearchResultsStories storySearchResults={feedExample} userSearchResults={usersExample} toggleSearchResultTabs={this.toggleSearchResultTabs}/>
        }
        </ContentWrapper>

      </Container>
    )
  }
}
