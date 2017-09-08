import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import RoundedButton from '../RoundedButton'
import OverlayStatic from '../OverlayStatic'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {SubTitle} from './Shared'

const Container = styled.div`
  position: relative;
`

const StoryOverlayContainer = styled(OverlayStatic)`
  margin-top: 40px;
  padding-top: 151%;
  width: 100%;
  max-width: 900px;
  max-height: 505px;
  background-image: ${props => `url(${getImageUrl(props.image)})`};
  background-size: cover;
  position: relative;
  z-index: -100;
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

const TitleContainer = styled.div`
  position: absolute;
  top: 30%;
  width: 100%;
`

const CloseImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 100;
`
const StyledSubTitle = styled(SubTitle)`
  color: ${props => props.theme.Colors.snow};
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
      <Container>
        <StoryOverlayContainer image={this.props.coverImage} overlayColor='black'/>
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
            <TitleContainer>
              <Title>{this.props.title}</Title>
              <StyledSubTitle>{this.props.description}</StyledSubTitle>              
            </TitleContainer>
      </Container>
      )
  }
}