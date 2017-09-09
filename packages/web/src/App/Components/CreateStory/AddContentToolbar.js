import React, { Component } from 'react'
import styled from 'styled-components'

import Icon from '../Icon'
import {Text} from './Shared'

import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import {Input} from './Shared'

const Container = styled.div``

const StyledInput = styled(Input)`
  font-size: 18px;
  line-height: 35px;
  text-align: left;
  font-style: italic;
  color: ${props => props.theme.Colors.grey}
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

export default class AddContentToolbar extends Component {

  constructor(props) {
    super(props)
    this.state = {toolBarOpen: false}
  }

  toggleToolbar = () => {
    this.setState({toolBarOpen: !this.state.toolBarOpen })
  }

  addVideo = () => { alert("SELECT VIDEO") }
  
  addPhoto = () => { alert("SELECT IMAGE") }
  
  addText = () => { alert("ADD TEXT") }
  
  addDetails = () => { alert("ADD DEETS") }

  closeImage = () => { alert("CLOSE IMAGE") }

  closeVideo = () => { alert("CLOSE VIDEO") }

  renderFullToolbar() {
    const buttonTypes = [
        {iconName: 'addCoverCamera', action: this.addPhoto},
        {iconName: 'video', action: this.addVideo},
        {iconName: 'story', action: this.addText},
        {iconName: '', action: this.addDetails},
      ]
    return buttonTypes.map((buttonType, index) => {
      return (
          <RoundedButton 
            key={index}
            type='opaqueGrey'
            padding='even' 
            margin='medium'
            width='50px'
            height='50px'                   
            onClick={buttonType.action}
          >
            <StyledIcon name={buttonType.iconName}/>          
          </RoundedButton>
      )
    })
  }

  renderCreateToolBar = () => {
    return (
      <Row>
          <RoundedButton 
            type='opaqueGrey'
            padding='evenMedium' 
            margin='medium'
            onClick={this.toggleToolbar}
          >
            <Icon name='createStory'/>          
          </RoundedButton>
          {!this.state.toolBarOpen && <StyledInput placeholder='Tell Your Story'/>}
          {this.state.toolBarOpen && this.renderFullToolbar()}
      </Row>
    )
  }

  render() {
    return (
      <Container>
        {this.renderCreateToolBar()}
      </Container>
    )
  }
}
