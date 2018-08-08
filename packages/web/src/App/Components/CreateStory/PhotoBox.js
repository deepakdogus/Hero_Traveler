import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import CloseX from '../CloseX'
import {CloseXContainer, StyledCaptionInput} from './Shared'

const Container = styled.div`
`

const ImageContainer = styled(Container)`
  margin-top: 40px;
  max-width: 900px;
  position: relative;
`

const StyledImage = styled.img`
  width: 100%;
`

export default class PhotoBox extends React.Component {
  static propTypes = {
    imageURL: PropTypes.string,
    closeImage: PropTypes.func,
    caption: PropTypes.string,
  }

  render() {
    const {imageURL, closeImage, caption} = this.props
    return (
      <Container>
        <ImageContainer>
          <StyledImage src={imageURL}/>
           <CloseXContainer>
            <CloseX onClick={closeImage}/>
          </CloseXContainer>
        </ImageContainer>
        <StyledCaptionInput placeholder={caption || 'Add a caption'}/>
      </Container>
    )
  }
}










