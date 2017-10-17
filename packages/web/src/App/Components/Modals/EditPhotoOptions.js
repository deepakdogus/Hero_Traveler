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
  margin: 0 2px;
`

const TrashIcon = styled(Icon)`
  width: 17px;
  margin: 0 4px;
  height: 23px;
`

export default class EditPhotoOptions extends React.Component {
  static propTypes = {
    onClickCrop: PropTypes.func,
  }

  render() {
    const {onClickCrop} = this.props
    return (
      <Container>
        <ModalRow>
          <ShareIcon name='share' />
          <VerticalCenter>
            <EditModalText>Upload Photo</EditModalText>
          </VerticalCenter>
        </ModalRow>
        <ModalRow onClick={onClickCrop}>
          <Icon name='createStory' />
          <VerticalCenter>
            <EditModalText>Reposition</EditModalText>
          </VerticalCenter>
        </ModalRow>
        <ModalRow>
          <TrashIcon name='trashBlack' />
          <VerticalCenter>
            <EditModalText>Remove</EditModalText>
          </VerticalCenter>
        </ModalRow>
      </Container>
    )
  }
}



