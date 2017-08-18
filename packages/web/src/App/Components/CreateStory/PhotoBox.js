import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import Image from '../Image'
import RoundedButton from '../RoundedButton'
import getImageUrl from '../../Shared/Lib/getImageUrl'

const Container = styled.div`
`

const ImageContainer = styled(Container)`
  margin-top: 40px;
  max-width: 900px;
  position: relative;
`

const StyledImage = styled(Image)`
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

const CloseImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 100;
`

export default class PhotoBox extends React.Component {
  static propTypes = {
    imageURL: PropTypes.string,
    closeImage: PropTypes.func,
    caption: PropTypes.string,
  }

  render() {
      return (
        <Container>
          <ImageContainer>
            <StyledImage src={this.props.imageURL}/>
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
          </ImageContainer>
          {this.props.caption && <Caption>{this.props.caption}</Caption>}
        </Container>
      )
  }
}










