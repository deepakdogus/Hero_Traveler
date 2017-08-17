import React, { Component } from 'react'
import styled from 'styled-components'

import Icon from '../Components/Icon'
import {Text} from '../Components/CreateStory/Shared'
import AddCoverPhotoBox from '../Components/CreateStory/AddCoverPhotoBox'
import CoverPhotoBox from '../Components/CreateStory/CoverPhotoBox'
import {Row} from '../Components/FlexboxGrid'
import VerticalCenter from '../Components/VerticalCenter'
import RoundedButton from '../Components/RoundedButton'
import SpaceBetweenRowWithIconsAndButtons from '../Components/SpaceBetweenRowWithIconsAndButtons'

import {feedExample} from './Feed_TEST_DATA'

//test data - Havana
const testStory = feedExample[Object.keys(feedExample)[8]];

const testCoverImage = testStory.coverImage || testStory.coverVideo



const Container = styled.div``


const PlaceholderText = styled(Text)`
  font-size: 18px;
  color: ${props => props.theme.Colors.navBarText}
`

const ContentWrapper = styled.div`
  margin: 0 17.057101%;
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

class CreateStory extends Component {

  constructor(props) {
    super(props)
    this.state = {toolBarOpen: false}
  }

  toggleToolbar = () => {
    this.setState({toolBarOpen: !this.state.toolBarOpen })
  }

  addCover = () => { alert("SELECT COVER IMAGE TO ADD") }
  
  addVideo = () => { alert("SELECT COVER IMAGE TO ADD") }
  
  addPhoto = () => { alert("SELECT PHOTO TO ADD") }
  
  addText = () => { return }
  
  addDetails = () => { return }

  closeImage = () => { alert("CLOSE IMAGE") }

  renderIcons = () => {
    return (
      <Container>
          <RoundedButton 
            type='grey'
            padding='even' 
            margin='small'
          >
            <Icon name='trash'/>
          </RoundedButton>
          <RoundedButton 
            type='grey'
            padding='even' 
            margin='small'
          >
            <Icon name='save'/>
          </RoundedButton>        
      </Container>
    )
  }

  renderButtons = () => {
    return (
      <Container>
          <RoundedButton
            text={'Preview'}
            margin='small'
            width='100px'
            type='grey'
          />
          <RoundedButton
            text={'Next  >'}
            margin='small'
            width='100px'
          />      
      </Container>
    )
  }

  renderFullToolbar() {
    const buttonTypes = [
        {iconName: 'photo', action: this.addPhoto},
        {iconName: 'video', action: this.addVideo},
        {iconName: 'story', action: this.addText},
        {iconName: '', action: this.addDetails},
      ]
    return buttonTypes.map((buttonType, index) => {
      return (
          <RoundedButton 
            key={index}
            type='lightGrey'
            padding='evenMedium'
            margin='medium'
            onClick={buttonType.action}
          >
            <Icon name={buttonType.iconName}/>          
          </RoundedButton>
      )
    })
  }

  renderCreateToolBar = () => {
    return (
      <Row>
          <RoundedButton 
            type='lightGrey'
            padding='evenMedium' 
            margin='medium'
            onClick={this.toggleToolbar}
          >
            <Icon name='createStory'/>          
          </RoundedButton>
          {this.state.toolBarOpen ? null : <PlaceholderText>Tell Your Story</PlaceholderText> }
          {this.state.toolBarOpen ? this.renderFullToolbar() : null }
      </Row>
    )
  }

  render() {
    return (
      <Container>
        <ContentWrapper>
          <ItemContainer>

            <AddCoverPhotoBox 
              action={this.addCover}
            />
            <CoverPhotoBox 
              coverImage={testCoverImage}
              title={testStory.title}
              description={testStory.description}
              closeImage={this.closeImage}
            />
            {this.renderCreateToolBar()}
          </ItemContainer>
        </ContentWrapper>
        <SpaceBetweenRowWithIconsAndButtons
          renderIcons={this.renderIcons}
          renderButtons={this.renderButtons}
        />        
      </Container>
    )
  }
}

export default CreateStory
