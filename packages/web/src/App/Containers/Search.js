import React, { Component } from 'react'
import styled from 'styled-components'

import Togglebar from '../Components/Togglebar'

const togglebarTabs = [
  { text: 'stories', isActive: true },
  { text: 'people', isActive: false },
]



const Container = styled.div``

const HeaderInputContainer = styled(Container)`
  background-color: ${props => props.theme.Colors.lightGreyAreas}
`

const HeaderInput = styled.input`
  height: 120px;
  width: 80%;
  background-color: transparent;
  font-weight: 400;
  font-size: 40px;
  padding-left: 30px;
  border: none;
  outline: none;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.signupGrey} 
`

const PlaceholderText = styled(Text)`
  font-size: 18px;
  color: ${props => props.theme.Colors.navBarText}
`

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }




  render() {
    return (
      <Container>
        <HeaderInputContainer>
          <HeaderInput placeholder='Type to search' />
        </HeaderInputContainer>
        <ContentWrapper>
          <Togglebar tabs={togglebarTabs} isClear={true}/>
        </ContentWrapper>

      </Container>
    )
  }
}

export default Search
