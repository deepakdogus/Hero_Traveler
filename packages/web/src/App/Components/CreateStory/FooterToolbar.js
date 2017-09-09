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

const Left = styled(Row)`
  position: absolute;
  left: 0;
`

const Right = styled(Row)`
  position: absolute;
  right: 0;
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
      <Container>
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
      </Container>
    )
  }

  renderButtons = () => {
    const {isDetailsView} = this.props
    return (
      <Container>
        {!isDetailsView &&
          <div>
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
          </div>
        }
        {isDetailsView &&
          <div>
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
          </div>
        }        
      </Container>
    )
  }

  render() {
    return (
      <Container>
        <Row>
          <Left>
            <Row>
              {this.renderIcons()}
            </Row>
          </Left>
          <Right>
            <Row>
              {this.renderButtons()}
            </Row>
          </Right>
        </Row>
      </Container>
    )
  }
}
