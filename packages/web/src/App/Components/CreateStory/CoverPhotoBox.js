import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import CloseX from '../CloseX'
import OverlayStatic from '../OverlayStatic'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {CloseXContainer, SubTitle} from './Shared'

const Container = styled.div`
  position: relative;
`

const StoryOverlayContainer = styled(OverlayStatic)`
  margin-top: 40px;
  padding-top: 505px;
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
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 50px;
  letter-spacing: 1.5px;
  margin: 0px;
`

const TitleContainer = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
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
    const {coverImage, closeImage, title, description} = this.props;
    return (
      <Container>
        <StoryOverlayContainer image={coverImage} overlayColor='lightBlack'/>
        <CloseXContainer>
          <CloseX onClick={closeImage}/>
        </CloseXContainer>
        <TitleContainer>
          <Title>{title}</Title>
          <StyledSubTitle>{description}</StyledSubTitle>
        </TitleContainer>
      </Container>
    )
  }
}
