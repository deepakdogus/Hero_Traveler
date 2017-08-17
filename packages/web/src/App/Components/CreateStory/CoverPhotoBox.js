import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import RoundedButton from '../RoundedButton'
import Overlay from '../Overlay'
import getImageUrl from '../../Shared/Lib/getImageUrl'


const StoryOverlayContainer = styled(Overlay)`
  margin-top: 40px;
  padding: 175px 0px;
  height: 100%;
  max-width: 900px;
  max-height: 505px;
  background-image: ${props => `url(${getImageUrl(props.image)})`};
  background-size: cover;
  position: relative;
`

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.snow}
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

const CloseImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 100;
`

export default class CoverPhotoBox extends React.Component {
  static propTypes = {
    coverImage: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    closeImage: PropTypes.func,
  }

  render() {
    return (
      <StoryOverlayContainer image={this.props.coverImage} overlayColor='black'>
          <CloseImage>
            <RoundedButton 
              type='grey'
              padding='even' 
              margin='small'
              onClick={this.props.closeImage}
            >
              <Icon name='close'/>
            </RoundedButton>                  
          </CloseImage>         

          <Title>{this.props.title}</Title>
          <SubTitle>{this.props.description}</SubTitle>        
      </StoryOverlayContainer>

      )
  }
}