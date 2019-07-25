import React, { Component } from 'react'
import styled from 'styled-components'

import {
  Container,
  Wrapper,
} from './Shared/DocumenationTabs'

const Question = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
`

const Answer = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.bioGrey};
  letter-spacing: .2px;
`

const FAQs = [
{q: 'What is HERO Traveler?', a: 'HERO Traveler is a first-of-its-kind platform that is all about coming together to share life’s incredible adventures.'},
{q: 'How do I join HERO Traveler?', a: 'Signing up is free and painless. You can either sign up within the app by creating a unique username, or quickly sign up by tapping the “Sign Up with Facebook” button on the Sign Up page.'},
{q: 'How do I post a story?', a: 'On the HERO Traveler site, simply click on the “Create” button at the top part of any page to bring upon the create a story page.'},
{q: 'Can I just post photos without any captions?', a: 'Of course! When creating a story, all you need is a cover photo and a title. However you want to curate your adventure is up to you!'},
{q: 'Do I need to shoot videos within the HERO Traveler app?', a: 'Nope, feel free to import videos. But remember that HERO Traveler is based around vertical video content. So unless you want to end up like Greedo at the cantina, you better shoot straight.'},
{q: 'How do I import a video?', a: 'After selecting the video option, simply tap at the bottom of the screen on “library” to bring up your videos from your camera roll.'},
{q: 'Does HERO Traveler support 4K Video?', a: 'While you cannot take 4K videos within the app itself just yet, you can still import 4K videos.'},
{q: 'How do I become a HERO Traveler Contributor?', a: 'Contributors are the cream of the crop, representing our most passionate users. To be labeled with the “Contributor” badge on your profile, you must first publish 200 stories or more. To learn about other eligibility requirements send us an email at <a href="mailto:contributors@herotraveler.com">contributors@herotraveler.com</a>'},
]

export default class FAQ extends Component {
  renderFAQs(FAQs) {
    return FAQs.map((FAQ, index) => {
      return (
        <Container key={index}>
          <Question>{FAQ.q}</Question>
          <Answer dangerouslySetInnerHTML={{__html: FAQ.a}} />
        </Container>
      )
    })
  }

  render() {
    return (
      <Wrapper>
        {this.renderFAQs(FAQs)}
      </Wrapper>
    )
  }
}
