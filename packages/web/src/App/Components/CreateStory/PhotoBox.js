import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import CloseX from '../CloseX'
import {CloseXContainer} from './Shared'

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

const Caption = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
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
        {this.props.caption && <Caption>{caption}</Caption>}
      </Container>
    )
  }
}










