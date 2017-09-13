import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'

const Container = styled.div`
  position: relative;
  margin: 20px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

export default class FooterToolbar extends Component {
  static propTypes = {
    isDetailsView: PropTypes.bool,
  }  

  renderIcons = () => {
    return (
      <Row middle='xs'>
        <RoundedButton 
          type='grey'
          padding='even' 
          margin='medium'
          width='50px'
          height='50px'
        >
          <StyledIcon name='trash'/>
        </RoundedButton>
        <RoundedButton 
          type='grey'
          padding='even' 
          margin='medium'
          width='50px'
          height='50px'            
        >
          <StyledIcon name='save'/>
        </RoundedButton>        
      </Row>
    )
  }

  renderButtons = () => {
    const {isDetailsView} = this.props
    return (
      <Container>
        {!isDetailsView &&
          <Row middle='xs'>
            <RoundedButton
              text={'Preview'}
              margin='medium'
              padding='even' 
              width='120px'
              type='grey'
            />
            <RoundedButton
              text={'Next >'}
              margin='medium'
              padding='even' 
              width='120px'
            />            
          </Row>
        }
        {isDetailsView &&
          <Row middle='xs'>
            <RoundedButton
              text={'< Back'}
              margin='medium'
              padding='even' 
              width='120px'
              type='grey'
            />
            <RoundedButton
              text={'Publish'}
              margin='medium'
              padding='even' 
              width='120px'
            />            
          </Row>
        }        
      </Container>
    )
  }

  render() {
    return (
      <Container>
        <Row between='xs'>
          {this.renderIcons()}
          {this.renderButtons()}
        </Row>
      </Container>
    )
  }
}
