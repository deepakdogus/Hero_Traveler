import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from '../../Shared/Web/Components/FlexboxGrid'
import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import Loader from '../../Shared/Web/Components/Loader'
import {Title} from './Shared'
import Cropper from '../Extensions/ExtendedCropper'

const avatarStyles = {
  clone: {
    borderRadius: '100%',
    border: '1px dashed #88f',
  },
  dotInnerNE: { display: 'none' },
  dotInnerNW: { display: 'none' },
  dotInnerSE: { display: 'none' },
  dotInnerSW: { display: 'none' },
  dotNE: { display: 'none' },
  dotNW: { display: 'none' },
  dotSE: { display: 'none' },
  dotSW: { display: 'none' },
  move: { outline: 'none' },
}

const Container = styled.div``

const StyledTitle = styled(Title)`
  color: ${props => props.theme.Colors.background};
  font-size: 18px;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  letter-spacing: .6px;
`

const ButtonRow = styled(Row)`
  padding-top: 25px;
`

export default class PhotoEditor extends React.Component {
  static propTypes = {
    isAvatar: PropTypes.bool,
    profile: PropTypes.object,
    users: PropTypes.object,
    closeModal: PropTypes.func,
    saveCroppedImage: PropTypes.func,
    loadedImage: PropTypes.string,
  }

  state = { srcLoaded: false }

  handleImageLoaded = () => {
    this.setState({srcLoaded: true})
  }

  onSave = () => {
    if (!this.refs.cropper) return
    const cropperNode = this.refs.cropper
    const croppedImg = cropperNode.crop()
    this.props.saveCroppedImage(croppedImg)
  }

  render() {
    const {isAvatar, closeModal, src} = this.props

    return (
      <Container>
        <StyledTitle>Edit {isAvatar ? 'Profile' : 'Cover'} Image</StyledTitle>
        {!this.state.srcLoaded &&
          <Row center="xs">
            <Loader />
          </Row>
        }
        <Cropper
          src={src}
          ref='cropper'
          onImgLoad={this.handleImageLoaded}
          styles={isAvatar ? avatarStyles : {}}
          allowNewSelection={false}
          onChange={this.onChange}
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
            text='SAVE'
            onClick={this.onSave}
          />
        </ButtonRow>
      </Container>
    )
  }
}
