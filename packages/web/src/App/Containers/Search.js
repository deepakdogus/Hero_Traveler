import React, { Component } from 'react'
import styled from 'styled-components'

import Togglebar from '../Components/Togglebar'
import TextButton from '../Components/TextButton'

const togglebarTabs = [
  { text: 'stories', isActive: true },
  { text: 'people', isActive: false },
]

const StyledTogglebar = styled(Togglebar)`
  background-color: ${props => props.theme.Colors.clear}
`

const Container = styled.div``

const HeaderInputContainer = styled(Container)`
  background-color: ${props => props.theme.Colors.lightGreyAreas}
`

const HeaderInput = styled.input`
  height: 120px;
  width: 80%;
  background-color: transparent;
  font-weight: 400;
  font-size: 30px;
  padding-left: 30px;
  border: none;
  outline: none;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.signupGrey} 
`


const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const StyledTextButton = styled(TextButton)`
  position: absolute;
  right: 40px;
  top: 227px;
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
          <StyledTextButton 
            textAlign='right'
            margin='none'
            text='Cancel'
          />
        </HeaderInputContainer>
        <ContentWrapper>
          <StyledTogglebar tabs={togglebarTabs} isClear={true}/>
        </ContentWrapper>

      </Container>
    )
  }
}

export default Search
