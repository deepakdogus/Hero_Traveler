import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Row} from '../FlexboxGrid'
import VerticalCenter from '../VerticalCenter'

const Container = styled.div``

const EditModalText = styled.p`
  color: ${props => props.theme.Colors.background};
  font-size: 15px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  margin: 0;
  padding-left: 25px;
`

const ModalRow = styled(Row)`
  padding: 10px;
`

const ShareIcon = styled(Icon)`
  width: 21px;
  height: 27px;
  margin: 0 2px 3px;
`

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const RepositionIcon = styled(Icon)`
  margin-right: 10px;
  padding-left: 0;
`

export default class EditPhotoOptions extends React.Component {
  static propTypes = {
    onCrop: PropTypes.func,
    onUpload: PropTypes.func,
    loadedImage: PropTypes.object,
  }

  render() {
    const {
      onCrop,
      onUpload,
      loadedImage
    } = this.props

    return (
      <Container>
        <label htmlFor='image_upload'>
          <ModalRow center='xs'>
            <ShareIcon name='share'/>
            <VerticalCenter>
              <EditModalText>Upload Photo</EditModalText>
            </VerticalCenter>
            <HiddenInput
              type='file'
              id='image_upload'
              onChange={onUpload}
            />
          </ModalRow>
        </label>
        { loadedImage &&
          <ModalRow center='xs' onClick={onCrop}>
            <RepositionIcon name='createPhoto' />
            <VerticalCenter>
              <EditModalText>Reposition</EditModalText>
            </VerticalCenter>
          </ModalRow>
        }
      </Container>
    )
  }
}



