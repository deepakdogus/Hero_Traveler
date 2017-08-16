import React, { Component } from 'react'
import styled from 'styled-components'

import Icon from '../Components/Icon'

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const Title = styled(CenteredText)`
  font-weigth: 400;
  font-size: 50px;
  letter-spacing: 1.5px;
`

const SubTitle = styled(CenteredText)`
  font-weigth: 400;
  font-size: 20px;
  letter-spacing: .7px;
`

const ContentWrapper = styled.div`
  margin: 0 17.057101%;
`

const ItemContainer = styled.div`
  margin: 20px 0;
`

const AddBox = styled.div`
  width: 100%;
  height: 100%;
  max-width: 900px;
  max-height: 505px;
  background-color: ${props => props.theme.Colors.pink};
  border: 1px dashed ${props => props.theme.Colors.redHighlights}
`


class Feed extends Component {
  render() {
    return (
      <ContentWrapper>
        <ItemContainer>
          <AddBox>
            <Icon name='photo' size='larger'></Icon>
            <Title>ADD TITLE</Title>
            <SubTitle>Add a subtitle</SubTitle>
          </AddBox>
        </ItemContainer>
      </ContentWrapper>
    )
  }
}

export default Feed
