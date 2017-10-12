import React, { Component } from 'react'
import styled from 'styled-components'

import Header from '../../Components/Signup/Header'
import RoundedButton from '../../Components/RoundedButton'
import HorizontalDivider from '../../Components/HorizontalDivider'
import SocialMediaRow from '../../Components/Signup/SocialMediaRow'
import FollowFollowingRow from '../../Components/FollowFollowingRow'
import {usersExample} from '../Feed_TEST_DATA'

const Container = styled.div`
  margin: 0 7.5%;
  text-align: center;
`

/*
Title and Subtitle are indentical in SignupSocial and SignupTopics
Possibly refactor into separate file or add styles to themes
*/
const Title = styled.p`
  font-weight: 400;
  font-size: 35px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
`

const Subtitle = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  margin-bottom: 30px;
`

const Section = styled.div`
  text-align: left;
  max-width: 1000px;
  margin: auto;
`

const SectionText = styled.h4`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 10px 20px;
`

class SignupSocial extends Component {

  renderSuggestedUsers(suggestedUsers) {
    const renderedSuggestions = Object.keys(suggestedUsers).reduce((suggestions, key, index) => {
      const user = suggestedUsers[key]
      const isSelected = index % 2 === 0
      if (index !== 0) suggestions.push((<HorizontalDivider key={`${key}-HR`} color='grey'/>))
      suggestions.push((
        <FollowFollowingRow
          key={key}
          user={user}
          isFollowing={isSelected}
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
        <div>
         <Header>
            <RoundedButton text='< Back' type="blackWhite"></RoundedButton>
            <RoundedButton text='Finish'></RoundedButton>
          </Header>
          <Container>
          <Title>FOLLOW</Title>
            <Subtitle>We'll add stories by people you follow to your custom reading list</Subtitle>
            <Section>
            <SectionText>FIND FRIENDS</SectionText>
              <SocialMediaRow text={'Facebook'} isConnected={true} />
              <HorizontalDivider color='grey'/>
              <SocialMediaRow text={'Twitter'} isConnected={false} />
              <HorizontalDivider color='grey'/>
              <SocialMediaRow text={'Instagram'} isConnected={false} />
            </Section>
            <Section>
              <SectionText>SUGGESTED PEOPLE</SectionText>
              {this.renderSuggestedUsers(usersExample)}
            </Section>
          </Container>
        </div>
    )
  }
}

export default SignupSocial
