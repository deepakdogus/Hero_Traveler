import React, { Component } from 'react'
import styled from 'styled-components'

import Header from '../../Components/Signup/Header'
import RoundedButton from '../../Components/RoundedButton'
import HorizontalDivider from '../../Components/HorizontalDivider'
import SocialMediaRow from '../../Components/Signup/SocialMediaRow'
import FollowFollowingRow from '../../Components/FollowFollowingRow'

const suggestedUsers ={"59026ecefecb3f2c4a405374":{"username":"rwoody","email":"rwoody@gmail.com","bio":"My name is Ryan. I like to build stuff.","isEmailVerified":false,"profile":{"fullName":"Ryan W","avatar":{"_id":"5940637919ee550010abb3a7","updatedAt":"2017-06-13T22:13:13.134Z","createdAt":"2017-06-13T22:13:13.134Z","user":"59026ecefecb3f2c4a405374","purpose":"avatar","altText":"FEB24891-FB3B-479B-A998-61EC386BA057.jpg","__v":0,"kind":"Image","original":{"filename":"FEB24891-FB3B-479B-A998-61EC386BA057.jpg","path":"files/6b1f3b36-f0c4-4fb4-83ad-fd5cbb3a027e-FEB24891-FB3B-479B-A998-61EC386BA057.jpg","bucket":"hero-traveler","meta":{"size":314945,"mimeType":"image/jpeg"}},"id":"5940637919ee550010abb3a7"},"cover":"5940638319ee550010abb3a8"},"passwordResetToken":"3da63f80-935a-44be-af9d-5e4c35019439","emailConfirmationToken":"12863a7a-94ac-4c4a-9723-c98c952f47b4","counts":{"followers":20,"following":4},"role":"admin","introTooltips":[{"_id":"59026eddfecb3f2c4a40537d","seen":true,"name":"my_feed"},{"name":"profile_no_stories","seen":true,"_id":"591e089baf711b0010b1abe7"},{"_id":"591e0cadaf711b0010b1abeb","seen":true,"name":"story_photo_take"},{"name":"story_photo_next","seen":true,"_id":"591e0caeaf711b0010b1abec"},{"_id":"591e0cb9af711b0010b1abed","seen":true,"name":"story_photo_edit"}],"notificationTypes":["story_comment","user_new_follower","story_like"],"id":"59026ecefecb3f2c4a405374","createdAt":"2017-04-27T22:21:02.826Z","updatedAt":"2017-07-12T18:18:26.517Z","isFacebookConnected":true,"devices":null},"59034dc3c6b6da001181760e":{"username":"jkarasin","email":"jkarasin@gmail.com","bio":"My name is Jesse and I am the PM on Hero Traveler!","isEmailVerified":false,"profile":{"fullName":"Jesse","avatar":{"_id":"59460e74dc84290010ffd8a5","updatedAt":"2017-06-18T05:24:04.931Z","createdAt":"2017-06-18T05:24:04.931Z","user":"59034dc3c6b6da001181760e","purpose":"avatar","altText":"80D5CF48-4757-4CB4-9237-83711361662C.jpg","__v":0,"kind":"Image","original":{"filename":"80D5CF48-4757-4CB4-9237-83711361662C.jpg","path":"files/47b7ad78-288c-4c68-afa4-3ad43814f1a5-80D5CF48-4757-4CB4-9237-83711361662C.jpg","bucket":"hero-traveler","meta":{"size":425304,"mimeType":"image/jpeg"}},"id":"59460e74dc84290010ffd8a5"},"cover":"59460ecddc84290010ffd8a6"},"passwordResetToken":"f10d49d9-5d83-49b2-ba24-64087ee6820d","emailConfirmationToken":"d64c6255-4c52-450f-b84c-702697246f8e","counts":{"followers":19,"following":5},"role":"admin","introTooltips":[{"_id":"59034ddbc6b6da001181761a","seen":true,"name":"my_feed"},{"name":"story_photo_take","seen":true,"_id":"591e126baf711b0010b1abf1"},{"_id":"591e1283af711b0010b1abf2","seen":true,"name":"story_photo_next"},{"name":"story_photo_edit","seen":true,"_id":"591e1307af711b0010b1abf6"},{"_id":"591e134faf711b0010b1abf8","seen":true,"name":"profile_no_stories"}],"notificationTypes":["story_comment","story_like","user_new_follower"],"id":"59034dc3c6b6da001181760e","createdAt":"2017-04-28T14:12:19.318Z","updatedAt":"2017-07-12T18:18:27.409Z","isFacebookConnected":false,"devices":null},"59034f0bc6b6da001181761e":{"username":"bkhoo","email":"boon@herogrp.com","bio":"Hello world.  This bio has been edited\n\nHello\n\n\nHello\nSjdjdj\nSjdjdj\nSjdjdj\nDjdjdj\n\nHello\n\nHello\nHello\n\nHello this is my bio\n\n\nHello\n\nHere we go\n\nHi\n\nHi\nHi\n\n\nHi\n\n\n\n\n\n\n\nHi\n\n\n\n\n\n\n\nHi\n\n\n\n\n\n\n\n\n\nHi\n\n\n\n\n\n\n\nHi\n\n\n\n\n\nMai\n\n\nHihi\n\n\n\n\n\nThe end\n\n\n\n\nI\n\n\n","isEmailVerified":false,"profile":{"fullName":"Boon","avatar":{"_id":"5967bac599fd2200107afeb9","updatedAt":"2017-07-13T18:24:05.950Z","createdAt":"2017-07-13T18:24:05.950Z","user":"59034f0bc6b6da001181761e","purpose":"avatar","altText":"D5567A3C-88A6-4DB5-9F8F-A48FC2801201.jpg","__v":0,"kind":"Image","original":{"filename":"D5567A3C-88A6-4DB5-9F8F-A48FC2801201.jpg","path":"files/9d9f16dd-330c-4d52-a0ea-0d4fc1a4f4de-D5567A3C-88A6-4DB5-9F8F-A48FC2801201.jpg","bucket":"hero-traveler","meta":{"size":44731,"mimeType":"image/jpeg"}},"id":"5967bac599fd2200107afeb9"},"cover":"59485b39dc84290010ffd93c"},"emailConfirmationToken":"a7d9ca11-862c-434f-9b99-7b9ddbe5329d","counts":{"followers":17,"following":20},"role":"admin","introTooltips":[{"_id":"59034f1dc6b6da0011817631","seen":true,"name":"my_feed"},{"name":"profile_no_stories","seen":true,"_id":"591e0993af711b0010b1abe9"},{"_id":"591e16ffaf711b0010b1abfe","seen":true,"name":"story_photo_take"},{"name":"story_photo_next","seen":true,"_id":"591e1703af711b0010b1abff"},{"_id":"591e170caf711b0010b1ac00","seen":true,"name":"story_photo_edit"}],"notificationTypes":["user_new_follower","story_like","story_comment"],"id":"59034f0bc6b6da001181761e","createdAt":"2017-04-28T14:17:47.090Z","updatedAt":"2017-07-13T18:24:10.984Z","isFacebookConnected":false,"devices":null},"5908b42ec6b6da00118176c6":{"username":"amber2394","email":"amber.maillard@rehashstudio.com","bio":"My name is Amber! Yup. ","isEmailVerified":false,"profile":{"fullName":"Amber Maillard","avatar":{"_id":"5925d3af553b650010623713","updatedAt":"2017-05-24T18:40:47.023Z","createdAt":"2017-05-24T18:40:47.023Z","user":"5908b42ec6b6da00118176c6","purpose":"avatar","altText":"1F5A8A03-AFF0-4A28-AB20-18B77B086906.jpg","__v":0,"kind":"Image","original":{"filename":"1F5A8A03-AFF0-4A28-AB20-18B77B086906.jpg","path":"files/3318025f-383b-4783-9f3a-d5c3966e844a-1F5A8A03-AFF0-4A28-AB20-18B77B086906.jpg","bucket":"hero-traveler","meta":{"size":58124,"mimeType":"image/jpeg"}},"id":"5925d3af553b650010623713"},"cover":"5925d7a2553b65001062371d"},"passwordResetToken":"e81bf2f1-e6e6-4b5e-b03a-287c9b37fbe8","emailConfirmationToken":"0eb7496c-2604-4f39-ae2f-875caa7aad2b","counts":{"followers":15,"following":7},"role":"admin","introTooltips":[{"_id":"5908b493c6b6da00118176d1","seen":true,"name":"my_feed"},{"name":"story_photo_next","seen":true,"_id":"5925d2e5553b65001062370c"},{"_id":"5925d2eb553b65001062370d","seen":true,"name":"story_photo_edit"},{"name":"story_photo_take","seen":true,"_id":"5925d37f553b650010623712"},{"_id":"5925d40c553b650010623715","seen":true,"name":"profile_no_stories"}],"notificationTypes":["story_comment","story_like","user_new_follower"],"id":"5908b42ec6b6da00118176c6","createdAt":"2017-05-02T16:30:38.492Z","updatedAt":"2017-07-05T17:03:18.711Z","isFacebookConnected":false,"devices":null},"59037cafc6b6da0011817682":{"username":"rehashstudio-james","email":"james@rehashstudio.com","isEmailVerified":false,"profile":{"fullName":"James Calhoun"},"emailConfirmationToken":"496849b7-4260-4056-8fc5-e22c4f58fcb2","counts":{"followers":13,"following":4},"role":"user","introTooltips":[{"_id":"59037cc0c6b6da001181768d","seen":true,"name":"my_feed"}],"notificationTypes":["story_comment","story_like","user_new_follower"],"id":"59037cafc6b6da0011817682","createdAt":"2017-04-28T17:32:31.452Z","updatedAt":"2017-06-30T15:15:11.007Z","isFacebookConnected":false,"devices":null},"590b9b0a4990800011537924":{"username":"joeanthony","email":"joeanthonynyc@gmail.com","bio":"","isEmailVerified":false,"profile":{"fullName":"Joe Anthony ","avatar":{"_id":"59185e3425a23d0011b059a4","updatedAt":"2017-05-14T13:40:04.169Z","createdAt":"2017-05-14T13:40:04.169Z","user":"590b9b0a4990800011537924","purpose":"avatar","altText":"49D62DA7-AA12-4522-BF17-FB6FC45EDC1A.jpg","__v":0,"kind":"Image","original":{"filename":"49D62DA7-AA12-4522-BF17-FB6FC45EDC1A.jpg","path":"files/6da78796-a7a8-455b-a650-a7be5608825c-49D62DA7-AA12-4522-BF17-FB6FC45EDC1A.jpg","bucket":"hero-traveler","meta":{"size":188318,"mimeType":"image/jpeg"}},"id":"59185e3425a23d0011b059a4"},"cover":"59185e1a25a23d0011b059a3"},"emailConfirmationToken":"117097ef-b955-43d5-bccf-9ac5dde823a8","counts":{"followers":9,"following":5},"role":"user","introTooltips":[{"_id":"590b9b8c499080001153793b","seen":true,"name":"my_feed"},{"name":"story_photo_take","seen":true,"_id":"591f1a0faf711b0010b1ac24"},{"_id":"5920afe1af711b0010b1ac7f","seen":true,"name":"profile_no_stories"},{"name":"story_photo_next","seen":true,"_id":"592102d0af711b0010b1ac83"},{"_id":"592102d8af711b0010b1ac84","seen":true,"name":"story_photo_edit"}],"notificationTypes":["story_like","story_comment","user_new_follower"],"id":"590b9b0a4990800011537924","createdAt":"2017-05-04T21:20:10.058Z","updatedAt":"2017-06-30T15:15:10.444Z","isFacebookConnected":false,"devices":null},"590b427ae275910010a28463":{"username":"James Calhoun","email":"james.calhoun@gmail.com","bio":"","isEmailVerified":false,"profile":{"fullName":"James Calhoun","avatar":{"_id":"5939e920f0d9f800100695de","updatedAt":"2017-06-09T00:17:36.171Z","createdAt":"2017-06-09T00:17:36.171Z","user":"590b427ae275910010a28463","purpose":"avatar","altText":"3677C034-C58B-4C56-9A80-09827F512E6E.jpg","__v":0,"kind":"Image","original":{"filename":"3677C034-C58B-4C56-9A80-09827F512E6E.jpg","path":"files/8bda5cbd-2e04-467a-9d89-12a31e50da47-3677C034-C58B-4C56-9A80-09827F512E6E.jpg","bucket":"hero-traveler","meta":{"size":434614,"mimeType":"image/jpeg"}},"id":"5939e920f0d9f800100695de"},"cover":"5939e933f0d9f800100695df"},"emailConfirmationToken":"4e752561-e70f-4aeb-b296-15648a5e9ea5","counts":{"followers":9,"following":6},"role":"user","introTooltips":[{"_id":"590b428ce275910010a28473","seen":true,"name":"my_feed"},{"name":"story_photo_next","seen":true,"_id":"5939e827f0d9f800100695d7"},{"_id":"5939e82bf0d9f800100695d8","seen":true,"name":"story_photo_edit"},{"name":"story_photo_take","seen":true,"_id":"5939e868f0d9f800100695da"},{"_id":"5939e8ecf0d9f800100695dd","seen":true,"name":"profile_no_stories"}],"notificationTypes":[null,null,null],"id":"590b427ae275910010a28463","createdAt":"2017-05-04T15:02:18.363Z","updatedAt":"2017-06-30T15:15:11.549Z","isFacebookConnected":true,"devices":null},"592f321558240f00106fa384":{"username":"ambertest5","email":"backwordz@gmail.com","isEmailVerified":false,"profile":{"fullName":"Amber"},"emailConfirmationToken":"181c3a0f-8b1e-423e-8c5c-a6fddac56a63","counts":{"followers":7,"following":2},"role":"user","introTooltips":[{"_id":"592f323058240f00106fa393","seen":true,"name":"my_feed"}],"notificationTypes":["story_like","story_comment","user_new_follower"],"id":"592f321558240f00106fa384","createdAt":"2017-05-31T21:13:57.668Z","updatedAt":"2017-07-05T17:03:23.880Z","isFacebookConnected":false,"devices":null},"5908c8dcc6b6da00118176e2":{"username":"ambertest","email":"amber.maillard23@gmail.com","isEmailVerified":false,"profile":{"fullName":"Amber Test"},"passwordResetToken":"731c353a-38c9-49b8-b3e2-8ede5d7d7859","emailConfirmationToken":"d105d583-e8b8-433e-a828-fcf9151fce2a","counts":{"followers":7,"following":1},"role":"user","introTooltips":[{"_id":"5908c8f7c6b6da00118176e7","seen":true,"name":"my_feed"}],"notificationTypes":["story_comment","story_like","user_new_follower"],"id":"5908c8dcc6b6da00118176e2","createdAt":"2017-05-02T17:58:52.370Z","updatedAt":"2017-07-05T17:03:25.347Z","isFacebookConnected":false,"devices":null},"59039b51c6b6da00118176a2":{"username":"joeanthonynyc","email":"joeanthony@herogrp.com","isEmailVerified":false,"profile":{"fullName":"Joe Anthony "},"emailConfirmationToken":"10f3eed3-26ae-4928-863f-fea890cf6952","counts":{"followers":6,"following":0},"role":"admin","introTooltips":[{"_id":"5903f097c6b6da00118176bc","seen":true,"name":"my_feed"}],"notificationTypes":["story_comment","story_like","user_new_follower"],"id":"59039b51c6b6da00118176a2","createdAt":"2017-04-28T19:43:13.477Z","updatedAt":"2017-06-30T15:15:12.261Z","isFacebookConnected":false,"devices":null}}

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
              {this.renderSuggestedUsers(suggestedUsers)}
            </Section>
          </Container>
        </div>
    )
  }
}

export default SignupSocial
