import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Cropper from '../Cropper'
import {Title} from './Shared'

const Container = styled.div``

const StyledTitle = styled(Title)`
  color: ${props => props.theme.Colors.background}
  font-size: 18px;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  letter-spacing: 1.5px;
`

const ButtonRow = styled(Row)`
  padding-top: 25px;
`

export default class PhotoEditor extends React.Component {
  static PropTypes = {
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
  }

  render() {
    const src='https://res.cloudinary.com/rehash-studio/image/upload/files/obsh1fnba0lfmqwfigdh.jpg'
    const {isAvatar, closeModal} = this.props
    return (
      <Container>
        <StyledTitle>Edit Cover Image</StyledTitle>
        <Cropper
          src={src}
          isAvatar={isAvatar}
        />
        <ButtonRow center='xs'>
          <RoundedButton
            margin='small'
            type={'blackWhite'}
            text={'CANCEL'}
            onClick={closeModal}
          />
          <RoundedButton
            width={'107px'}
            margin='small'
            text='SAVE'/>
        </ButtonRow>
      </Container>
    )
  }
}
