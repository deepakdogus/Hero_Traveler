import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import VerticalCenter from '../VerticalCenter'
import Modal from 'react-modal'
import EditPhotoOptions from '../Modals/EditPhotoOptions'
import PhotoEditor from '../Modals/PhotoEditor'
import uploadFile from '../../Utils/uploadFile'

import {
  Username,
  ItalicText,
  Centered,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
  BottomLeft,
  BottomLeftText,
  Container
} from './ProfileHeaderShared'

const customModalStyles = {
  content: {
    width: 420,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  }
}

const CameraIcon = styled(Icon)`
  width: 31px;
  height: 24px;
`

const EditAvatarWrapper = styled(VerticalCenter)`
  position: absolute;
  align-items: center;
  width: 100%;
  height: 100%;
`

const BioInput = styled.textarea`
  color: ${props => props.theme.Colors.snow};
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  height: 160px;
  width: 450px;
  background-color: ${props => props.theme.Colors.backgroundOpaque};
  border: ${props => `1px solid ${props.theme.Colors.snow}`};
  margin: 10px auto 0;
  padding: 30px 20px;
  resize: none;
`

export default class ProfileHeaderEdit extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      bioText: undefined,
      modal: undefined,
      photoType: undefined,
      loadedImage: undefined
    }
  }

  closeModal = () => {
    this.setState({
      modal: undefined,
      loadedImage: undefined,
    })
  }

  setOptionsState = (type) => {
    this.setState({
      modal: 'editPhotoOptions',
      photoType: type
    })
  }

  openCoverOptions = () => {
    this.setOptionsState('cover')
  }

  openAvatarOptions = () => {
    this.setOptionsState('avatar')
  }

  onChangeText = (event) => {
    this.setState({ bioText: event.target.value })
  }

  openCrop = () => {
    this.setState({ modal: 'photoEditor'})
  }

  // add backend logic later
  saveCroppedImage = (croppedImage) => {
    const stateUpdates = { modal: undefined }
    stateUpdates[this.state.photoType] = croppedImage
    this.setState(stateUpdates)
  }

  uploadImage = (event) => {
    uploadFile(event, this, (file) => {
      this.setState({
        loadedImage: file,
        modal: 'photoEditor',
      })
    })
  }

  render () {
    const {user} = this.props
    const {bioText, loadedImage, modal, photoType} = this.state
    const avatarUrl = getImageUrl(user.profile.avatar, 'avatar')

    let targetedImage
    if (photoType === 'avatar') targetedImage = avatarUrl
    else if (photoType === 'cover') targetedImage = getImageUrl(user.profile.cover)

    return (
      <Container>
        <Centered>
          <Username>{user.username}</Username>
          <AvatarWrapper>
            <EditAvatarWrapper>
              <CameraIcon
                type='avatar'
                name='camera'
                onClick={this.openAvatarOptions}
              />
            </EditAvatarWrapper>
            <StyledAvatar
              avatarUrl={avatarUrl}
              type='profile'
              size='x-large'
            />
          </AvatarWrapper>
          <ItalicText>Edit Bio</ItalicText>
          <BioInput
            type='text'
            value={bioText}
            placeholder='Enter your bio'
            onChange={this.onChangeText}
          />
          <ButtonWrapper>
            <RoundedButton
              margin='small'
              type={'opaque'}
              text={'CANCEL'}
            />
            <RoundedButton
              margin='small'
              text='SAVE CHANGES'/>
          </ButtonWrapper>
          <BottomLeft>
            <Row onClick={this.openCoverOptions}>
              <CameraIcon name='camera' type='cover'/>
              <BottomLeftText>EDIT COVER IMAGE</BottomLeftText>
            </Row>
          </BottomLeft>
        </Centered>

        <Modal
          contentLabel='Edit Photo Options'
          isOpen={modal === 'editPhotoOptions'}
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <EditPhotoOptions
            onCrop={this.openCrop}
            onUpload={this.uploadImage}
            hasImage={!!targetedImage}
          />
        </Modal>
        <Modal
          contentLabel='Photo Editor'
          isOpen={modal === 'photoEditor'}
          style={customModalStyles}
        >
          <PhotoEditor
            isAvatar={photoType === 'avatar'}
            closeModal={this.closeModal}
            saveCroppedImage={this.saveCroppedImage}
            src={loadedImage || targetedImage}
          />
        </Modal>
      </Container>
    )
  }
}
