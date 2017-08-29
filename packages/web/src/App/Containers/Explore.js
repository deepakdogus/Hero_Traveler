import React, { Component } from 'react'
import styled from 'styled-components'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer';

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const ExploreText = styled(CenteredText)`
  font-weigth: 400;
  font-size: 23px;
  letter-spacing: 1.5px;
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
`

const More = styled(CenteredText)`
  font-size: 15px;
  letter-spacing: 1.2px;
`

class Explore extends Component {
  render() {
    return (
      <Wrapper>
        <ExploreHeader/>      
        <ContentWrapper>
          <ExploreText>EXPLORE</ExploreText>
          <More>SHOW MORE</More>
          <More>Need downwards black arrow</More>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default Explore
