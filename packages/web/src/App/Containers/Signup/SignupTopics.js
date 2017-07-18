import React, { Component } from 'react'
import styled, {ThemeProvider} from 'styled-components'

import themes from '../../Shared/Themes'
import Header from '../../Components/Signup/Header'
import RoundedButton from '../../Components/RoundedButton'
import ExploreGrid from '../../Components/ExploreGrid'

const categories = [{"_id":"59012d8660ef1dbbe516bc74","selected": "true","updatedAt":"2017-05-22T15:13:58.164Z","createdAt":"2017-04-26T23:30:14.113Z","title":"Food","__v":0,"deleted":false,"counts":{"stories":6,"followers":0},"image":{"altText":"Food","versions":{"thumbnail240":{"filename":"food.jpg","path":"category/thumbnail240/food.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"food.jpg","path":"category/food.jpg","width":4988,"height":2897,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc74"},{"_id":"59012d8660ef1dbbe516bc7b","updatedAt":"2017-05-22T15:13:58.165Z","createdAt":"2017-04-26T23:30:14.119Z","title":"Mexico","__v":0,"deleted":false,"counts":{"stories":11,"followers":0},"image":{"altText":"Mexico","versions":{"thumbnail240":{"filename":"mexico.jpg","path":"category/thumbnail240/mexico.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"mexico.jpg","path":"category/mexico.jpg","width":3305,"height":2200,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":true,"isDefault":true,"id":"59012d8660ef1dbbe516bc7b"},{"_id":"59012d8660ef1dbbe516bc80","updatedAt":"2017-05-22T15:13:58.174Z","createdAt":"2017-04-26T23:30:14.122Z","title":"Romance","__v":0,"deleted":false,"counts":{"stories":8,"followers":0},"image":{"altText":"Romance","versions":{"thumbnail240":{"filename":"romance.jpg","path":"category/thumbnail240/romance.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"romance.jpg","path":"category/romance.jpg","width":5472,"height":3648,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc80"},{"_id":"59012d8660ef1dbbe516bc84","updatedAt":"2017-05-22T15:13:58.173Z","createdAt":"2017-04-26T23:30:14.124Z","title":"Sports","__v":0,"deleted":false,"counts":{"stories":4,"followers":0},"image":{"altText":"Sports","versions":{"thumbnail240":{"filename":"sports.jpg","path":"category/thumbnail240/sports.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"sports.jpg","path":"category/sports.jpg","width":3780,"height":2544,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc84"},{"_id":"59012d8660ef1dbbe516bc68","updatedAt":"2017-05-22T15:13:58.173Z","createdAt":"2017-04-26T23:30:14.099Z","title":"Asia","__v":0,"deleted":false,"counts":{"stories":6,"followers":0},"image":{"altText":"Asia","versions":{"thumbnail240":{"filename":"asia.jpg","path":"category/thumbnail240/asia.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"asia.jpg","path":"category/asia.jpg","width":4462,"height":2975,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc68"},{"_id":"59012d8660ef1dbbe516bc67","updatedAt":"2017-05-20T18:50:09.863Z","createdAt":"2017-04-26T23:30:14.098Z","title":"Africa","__v":0,"deleted":false,"counts":{"stories":2,"followers":0},"image":{"altText":"Africa","versions":{"thumbnail240":{"filename":"africa.jpg","path":"category/thumbnail240/africa.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"africa.jpg","path":"category/africa.jpg","width":4928,"height":3264,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc67"},{"_id":"59012d8660ef1dbbe516bc6a","updatedAt":"2017-05-20T00:39:25.639Z","createdAt":"2017-04-26T23:30:14.102Z","title":"Beaches","__v":0,"deleted":false,"counts":{"stories":4,"followers":0},"image":{"altText":"Beaches","versions":{"thumbnail240":{"filename":"beaches.jpg","path":"category/thumbnail240/beaches.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"beaches.jpg","path":"category/beaches.jpg","width":7360,"height":4912,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6a"},{"_id":"59012d8660ef1dbbe516bc6b","updatedAt":"2017-05-20T00:39:25.613Z","createdAt":"2017-04-26T23:30:14.103Z","title":"Boats","__v":0,"deleted":false,"counts":{"stories":3,"followers":0},"image":{"altText":"Boats","versions":{"thumbnail240":{"filename":"boats.jpg","path":"category/thumbnail240/boats.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"boats.jpg","path":"category/boats.jpg","width":5368,"height":6816,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6b"},{"_id":"59012d8660ef1dbbe516bc6d","updatedAt":"2017-05-20T00:39:25.640Z","createdAt":"2017-04-26T23:30:14.105Z","title":"Charity","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Charity","versions":{"thumbnail240":{"filename":"charity.jpg","path":"category/thumbnail240/charity.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"charity.jpg","path":"category/charity.jpg","width":5008,"height":3336,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6d"},{"_id":"59012d8660ef1dbbe516bc6f","updatedAt":"2017-05-20T00:39:25.639Z","createdAt":"2017-04-26T23:30:14.108Z","title":"Eco","__v":0,"deleted":false,"counts":{"stories":2,"followers":0},"image":{"altText":"Eco","versions":{"thumbnail240":{"filename":"eco.jpg","path":"category/thumbnail240/eco.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"eco.jpg","path":"category/eco.jpg","width":4300,"height":2867,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6f"},{"_id":"59012d8660ef1dbbe516bc70","updatedAt":"2017-05-20T00:39:25.638Z","createdAt":"2017-04-26T23:30:14.111Z","title":"Europe","__v":0,"deleted":false,"counts":{"stories":2,"followers":0},"image":{"altText":"Europe","versions":{"thumbnail240":{"filename":"europe.jpg","path":"category/thumbnail240/europe.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"europe.jpg","path":"category/europe.jpg","width":5184,"height":3456,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc70"},{"_id":"59012d8660ef1dbbe516bc72","updatedAt":"2017-05-16T17:54:09.222Z","createdAt":"2017-04-26T23:30:14.112Z","title":"Family","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Family","versions":{"thumbnail240":{"filename":"family.jpg","path":"category/thumbnail240/family.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"family.jpg","path":"category/family.jpg","width":4752,"height":3168,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc72"},{"_id":"59012d8660ef1dbbe516bc71","updatedAt":"2017-05-16T17:54:09.208Z","createdAt":"2017-04-26T23:30:14.111Z","title":"Exotic","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Exotic","versions":{"thumbnail240":{"filename":"exotic.jpg","path":"category/thumbnail240/exotic.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"exotic.jpg","path":"category/exotic.jpg","width":4838,"height":3204,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc71"},{"_id":"59012d8660ef1dbbe516bc75","updatedAt":"2017-04-26T23:30:14.114Z","createdAt":"2017-04-26T23:30:14.114Z","title":"Forest","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Forest","versions":{"thumbnail240":{"filename":"forest.jpg","path":"category/thumbnail240/forest.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"forest.jpg","path":"category/forest.jpg","width":5472,"height":3648,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc75"},{"_id":"59012d8660ef1dbbe516bc78","updatedAt":"2017-04-26T23:30:14.116Z","createdAt":"2017-04-26T23:30:14.116Z","title":"History","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"History","versions":{"thumbnail240":{"filename":"history.jpg","path":"category/thumbnail240/history.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"history.jpg","path":"category/history.jpg","width":5472,"height":3648,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc78"},{"_id":"59012d8660ef1dbbe516bc7a","updatedAt":"2017-04-26T23:30:14.117Z","createdAt":"2017-04-26T23:30:14.117Z","title":"Latin America","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Latin America","versions":{"thumbnail240":{"filename":"latin-america.jpg","path":"category/thumbnail240/latin-america.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"latin-america.jpg","path":"category/latin-america.jpg","width":5908,"height":3834,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc7a"},{"_id":"59012d8660ef1dbbe516bc7c","updatedAt":"2017-05-16T17:54:09.228Z","createdAt":"2017-04-26T23:30:14.120Z","title":"North America","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"North America","versions":{"thumbnail240":{"filename":"north-america.jpg","path":"category/thumbnail240/north-america.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"north-america.jpg","path":"category/north-america.jpg","width":3665,"height":5079,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc7c"},{"_id":"59012d8660ef1dbbe516bc82","updatedAt":"2017-04-26T23:30:14.123Z","createdAt":"2017-04-26T23:30:14.123Z","title":"South Pacific","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"South Pacific","versions":{"thumbnail240":{"filename":"south-pacific.jpg","path":"category/thumbnail240/south-pacific.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"south-pacific.jpg","path":"category/south-pacific.jpg","width":8512,"height":5664,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc82"},{"_id":"59012d8660ef1dbbe516bc81","updatedAt":"2017-05-12T23:40:36.989Z","createdAt":"2017-04-26T23:30:14.123Z","title":"South America","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"South America","versions":{"thumbnail240":{"filename":"south-america.jpg","path":"category/thumbnail240/south-america.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"south-america.jpg","path":"category/south-america.jpg","width":3744,"height":5616,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc81"},{"_id":"59012d8660ef1dbbe516bc79","updatedAt":"2017-05-12T23:40:36.977Z","createdAt":"2017-04-26T23:30:14.117Z","title":"Jetsetter","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Jetsetter","versions":{"thumbnail240":{"filename":"jetsetter.jpg","path":"category/thumbnail240/jetsetter.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"jetsetter.jpg","path":"category/jetsetter.jpg","width":3885,"height":2565,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc79"},{"_id":"59012d8660ef1dbbe516bc7f","updatedAt":"2017-05-12T23:40:36.974Z","createdAt":"2017-04-26T23:30:14.122Z","title":"Road Trips","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Road Trips","versions":{"thumbnail240":{"filename":"road-trips.jpg","path":"category/thumbnail240/road-trips.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"road-trips.jpg","path":"category/road-trips.jpg","width":5120,"height":3413,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc7f"},{"_id":"59012d8660ef1dbbe516bc7e","updatedAt":"2017-04-26T23:30:14.121Z","createdAt":"2017-04-26T23:30:14.121Z","title":"Photogenic","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Photogenic","versions":{"thumbnail240":{"filename":"photogenic.jpg","path":"category/thumbnail240/photogenic.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"photogenic.jpg","path":"category/photogenic.jpg","width":3300,"height":2202,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc7e"},{"_id":"59012d8660ef1dbbe516bc85","updatedAt":"2017-05-16T17:54:09.223Z","createdAt":"2017-04-26T23:30:14.125Z","title":"Staycation","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Staycation","versions":{"thumbnail240":{"filename":"staycation.jpg","path":"category/thumbnail240/staycation.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"staycation.jpg","path":"category/staycation.jpg","width":4499,"height":2999,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc85"},{"_id":"59012d8660ef1dbbe516bc83","updatedAt":"2017-05-16T17:54:09.223Z","createdAt":"2017-04-26T23:30:14.124Z","title":"Spiritual","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Spiritual","versions":{"thumbnail240":{"filename":"spiritual.jpg","path":"category/thumbnail240/spiritual.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"spiritual.jpg","path":"category/spiritual.jpg","width":5184,"height":3456,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc83"},{"_id":"59012d8560ef1dbbe516bc66","updatedAt":"2017-04-26T23:30:14.092Z","createdAt":"2017-04-26T23:30:14.092Z","title":"Adventure","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Adventure","versions":{"thumbnail240":{"filename":"adventure.jpg","path":"category/thumbnail240/adventure.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"adventure.jpg","path":"category/adventure.jpg","width":4000,"height":3000,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8560ef1dbbe516bc66"},{"_id":"59012d8660ef1dbbe516bc69","updatedAt":"2017-04-26T23:30:14.101Z","createdAt":"2017-04-26T23:30:14.101Z","title":"Australia","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Australia","versions":{"thumbnail240":{"filename":"australia.jpg","path":"category/thumbnail240/australia.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"australia.jpg","path":"category/australia.jpg","width":2000,"height":1333,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc69"},{"_id":"59012d8660ef1dbbe516bc6e","updatedAt":"2017-04-26T23:30:14.106Z","createdAt":"2017-04-26T23:30:14.106Z","title":"Cold Places","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Cold Places","versions":{"thumbnail240":{"filename":"cold-places.jpg","path":"category/thumbnail240/cold-places.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"cold-places.jpg","path":"category/cold-places.jpg","width":6016,"height":4016,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6e"},{"_id":"59012d8660ef1dbbe516bc6c","updatedAt":"2017-05-14T22:39:41.076Z","createdAt":"2017-04-26T23:30:14.104Z","title":"Caribbean","__v":0,"deleted":false,"counts":{"stories":2,"followers":0},"image":{"altText":"Caribbean","versions":{"thumbnail240":{"filename":"caribbean.jpg","path":"category/thumbnail240/caribbean.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"caribbean.jpg","path":"category/caribbean.jpg","width":4288,"height":2848,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc6c"},{"_id":"59012d8660ef1dbbe516bc73","updatedAt":"2017-04-26T23:30:14.112Z","createdAt":"2017-04-26T23:30:14.112Z","title":"Festivals","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Festivals","versions":{"thumbnail240":{"filename":"festivals.jpg","path":"category/thumbnail240/festivals.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"festivals.jpg","path":"category/festivals.jpg","width":4000,"height":2670,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc73"},{"_id":"59012d8660ef1dbbe516bc77","updatedAt":"2017-04-26T23:30:14.115Z","createdAt":"2017-04-26T23:30:14.115Z","title":"Guy Trips","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Guy Trips","versions":{"thumbnail240":{"filename":"guy-trips.jpg","path":"category/thumbnail240/guy-trips.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"guy-trips.jpg","path":"category/guy-trips.jpg","width":4928,"height":3264,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc77"},{"_id":"59012d8660ef1dbbe516bc76","updatedAt":"2017-04-26T23:30:14.115Z","createdAt":"2017-04-26T23:30:14.115Z","title":"Girl Trips","__v":0,"deleted":false,"counts":{"stories":0,"followers":0},"image":{"altText":"Girl Trips","versions":{"thumbnail240":{"filename":"girl-trips.jpg","path":"category/thumbnail240/girl-trips.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"girl-trips.jpg","path":"category/girl-trips.jpg","width":6965,"height":4649,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc76"},{"_id":"59012d8660ef1dbbe516bc7d","updatedAt":"2017-05-14T17:54:19.535Z","createdAt":"2017-04-26T23:30:14.120Z","title":"Off Grid","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Off Grid","versions":{"thumbnail240":{"filename":"off-grid.jpg","path":"category/thumbnail240/off-grid.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"off-grid.jpg","path":"category/off-grid.jpg","width":4256,"height":2832,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc7d"},{"_id":"59012d8660ef1dbbe516bc86","updatedAt":"2017-05-18T21:36:24.679Z","createdAt":"2017-04-26T23:30:14.126Z","title":"Wellness","__v":0,"deleted":false,"counts":{"stories":1,"followers":0},"image":{"altText":"Wellness","versions":{"thumbnail240":{"filename":"wellness.jpg","path":"category/thumbnail240/wellness.jpg","width":240,"height":240,"meta":{"mimeType":"image/jpeg"}}},"original":{"filename":"wellness.jpg","path":"category/wellness.jpg","width":5184,"height":3456,"meta":{"mimeType":"image/jpeg"}}},"isPromoted":false,"isDefault":true,"id":"59012d8660ef1dbbe516bc86"}]

const Container = styled.div`
  margin: 0 7.5%;
  text-align: center;
`
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

const SizedDiv = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

class SignupTopics extends Component {
  render() {
    return (
      <ThemeProvider theme={themes}>
        <div>
          <Header>
            <RoundedButton text='Next >'></RoundedButton>
          </Header>
          <Container>
            <SizedDiv>
              <Title>WELCOME!</Title>
              <Subtitle>Pick some topics you are interested in. We will use them to customize your reading list based on your interests.</Subtitle>
              <ExploreGrid categories={categories}/>
            </SizedDiv>
          </Container>
        </div>
      </ThemeProvider>
    )
  }
}

export default SignupTopics
