import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

const FAQContainer = styled.div``

const Question = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
`

const Answer = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.bioGrey};
  letter-spacing: .7px;
`

const FAQs = [
{q: 'What is HERO Traveler?', a: 'HERO Traveler is a first-of-its-kind platform that is all about coming together to share life’s incredible adventures.'},
{q: 'How do I join HERO Traveler?', a: 'Signing up is free and painless. You can either sign up within the app by creating a unique username, or quickly sign up by tapping the “Sign Up with Facebook” or “Sign up with Twitter” buttons on the Sign Up page.'},
{q: 'How do I post a story?', a: 'On the HERO Traveler App, simply tap the “plus” sign at the bottom of any page to bring up the option to create a story or start filming a video.'},
{q: 'Can I just post photos without any captions?', a: 'Of course! When creating a story, all you need is a cover photo and a title. However you want to curate your adventure is up to you!'},
{q: 'Do I need to shoot videos within the HERO Traveler app?', a: 'Nope, feel free to import videos. But remember that HERO Traveler is based around vertical video content. So unless you want to end up like Greedo at the cantina, you better shoot straight.'},
{q: 'How do I import a video?', a: 'After selecting the video option, simply tap at the bottom of the screen on “library” to bring up your videos from your camera roll.'},
{q: 'Does HERO Traveler support 4K Video?', a: 'While you cannot take 4K videos within the app itself just yet, you can still import 4K videos.'},
{q: 'How do I become a HERO Traveler Contributor?', a: 'On the HERO Traveler App, simply tap the “plus” sign at the bottom of any page to bring up the option to create a story or start filming a video.'},
{q: 'How do I post a story?', a: 'Contributors are the cream of the crop, representing our most passionate users. To be labeled with the “Contributor” star on your profile, you must first publish 200 stories or more. To learn about other eligibility requirements, click here/ send us an email at contributors@herotraveler.com'},
]

export default class FAQContent extends React.Component {

  renderFAQs(FAQs) {
    return FAQs.map((FAQ, index) => {
      return (
        <FAQContainer key={index}>
          <Question>{FAQ.q}</Question>
          <Answer>{FAQ.a}</Answer>
        </FAQContainer>
      )
    })
  }

  render () {
    return (
      <Container>
        {this.renderFAQs(FAQs)}
      </Container>
    )
  }
}