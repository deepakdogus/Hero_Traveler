import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import VerticalCenter from '../VerticalCenter'
import Modal from 'react-modal'
import EditPhotoOptions from '../Modals/EditPhotoOptions'
import PhotoEditor from '../Modals/PhotoEditor'
import uploadFile from '../../Utils/uploadFile'
import { FieldConstraints as SignupConstants } from '../../Shared/Lib/userFormValidation'

import {
  StyledAvatar,
  ButtonWrapper,
} from './ProfileHeaderShared'
import ResizableTextarea from '../ResizableTextarea'

const customModalStyles = {
  content: {
    border: '0',
    bottom: 'auto',
    minHeight: '10rem',
    left: '50%',
    padding: '2rem',
    position: 'fixed',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    minWidth: '20rem',
    maxWidth: '28rem',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  },
}

const CameraIcon = styled(Icon)`
  width: 31px;
  height: 24px;
`

const EditAvatarWrapper = styled(VerticalCenter)`
  position: absolute;
  align-items: center;
  height: 100%;
  z-index: 1;
  left: 54.5px;
`

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  margin-top: 60px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
    margin-top: 20px;
  }
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${props => props.theme.Colors.redHighlights};
  text-align: left;
  padding-left: 5px;
  padding-top: 2px;
`

const SaveCancelButtonWrapper = styled(ButtonWrapper)`
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
`

const SaveCancelButton = styled(RoundedButton)`
  margin: 0px 10px;
`

const RelativeWrapper = styled.div`
  position: relative;
  display: flex;
`

const UpdatePictureText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  letter-spacing: .2px;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  margin-left: 20px;
  cursor: pointer;
`

const Label = styled.label`
  display: block;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  letter-spacing: .2px;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  margin: 16px 0 8px;
`

const BaseInputStyles = `
  font-weight: 400;
  letter-spacing: .2px;
  font-size: 18px;
  width: 100%;
`

const Input = styled.input`
  ${BaseInputStyles};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  border-color: ${props => props.theme.Colors.navBarText};
  border-width: 0 0 1px 0;
  padding-bottom: 6px;
`

const Textarea = styled.textarea`
  ${BaseInputStyles};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  resize: none;
  border: none;
  outline: none;
`

const ResizableTextareaStyles = `
  ${BaseInputStyles};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
`

const TextareaWrapper = styled.div`
  border-color: ${props => props.theme.Colors.navBarText};
  border-width: 1px;
  border-style: solid;
  border-radius: 2.5px;
  padding: 10px;
`

const InputsWrapper = styled.div`
  margin: 40px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 20px 0;
  }
`

function getInitialState(user = {}) {
  return {
    bio: user.bio,
    fullname: user.profile ? user.profile.fullName : undefined,
    username: user.username,
    about: user.about,
    modal: undefined,
    photoType: undefined,
    loadedImage: undefined,
  }
}

export default class ProfileHeaderEdit extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
    bio: PropTypes.string,
    error: PropTypes.object,
    updateUser: PropTypes.func,
    uploadMedia: PropTypes.func,
    toProfileView: PropTypes.func,
    updating: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = getInitialState(props.user)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.user.id !== this.props.user.id) {
      this.setState({
        bio: nextProps.user.bio,
        username: nextProps.user.username,
      })
    }
    // If save was successful, reroute
    if (!!this.props.updating && !nextProps.updating && !nextProps.error) {
      this.props.toProfileView()
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
      photoType: type,
    })
  }

  openCoverOptions = () => {
    this.setOptionsState('userCover')
  }

  openAvatarOptions = () => {
    this.setOptionsState('avatar')
  }

  onChangeText = (event) => {
    let newText = event.target.value

    if (event.target.name === 'about') {
      // trim new lines
      newText = newText.replace(/\n|\r/g, '')
    }

    this.setState({ [event.target.name]: newText })
  }

  openCrop = () => {
    this.setState({ modal: 'photoEditor'})
  }

  // add backend logic later
  saveCroppedImage = (croppedImageUrl) => {
    // formatting into blob for upload
    fetch(croppedImageUrl)
    .then(res => {
      this.props.uploadMedia(
        this.props.user.id,
        res,
        this.state.photoType,
      )
      const stateUpdates = { modal: undefined }
      stateUpdates[this.state.photoType] = croppedImageUrl
      this.setState(stateUpdates)
    })
  }

  uploadImageToBrowser = (event) => {
    uploadFile(event, this, (file) => {
      this.setState({
        loadedImage: file,
        modal: 'photoEditor',
      })
    })
  }

  onCancel = () => {
    this.setState(getInitialState(), () => {
      this.props.toProfileView()
    })
  }

  onSave = () => {
    this.props.updateUser({
      bio: this.state.bio,
      username: this.state.username,
      about: this.state.about,
      profile: {
        fullName: this.state.fullname,
        // avatar: this.props.user.profile.avatar,
      },
    })
  }

  render () {
    const {user, error} = this.props
    const {
      bio,
      loadedImage,
      modal, photoType,
      username,
      about,
      fullname,
    } = this.state
    const avatarUrl = getImageUrl(user.profile.avatar, 'avatarLarge')
    const minRows = 7
    const bioLines =
      (bio && typeof bio === 'string')
      ? (bio.match(/\r?\n/g) || '').length + 1
      : minRows
    let targetedImage

    if (photoType === 'avatar') targetedImage = avatarUrl
    else if (photoType === 'userCover') targetedImage = getImageUrl(user.profile.cover, 'avatarLarge')

    return (
      <Container>
        <RelativeWrapper>
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
            isProfileHeader={false}
          />
          <VerticalCenter>
            <UpdatePictureText
              onClick={this.openAvatarOptions}
            >
              Update profile picture
            </UpdatePictureText>
          </VerticalCenter>
        </RelativeWrapper>
        <InputsWrapper>
          <Label>Name</Label>
          <Input
            value={fullname}
            name='fullname'
            onChange={this.onChangeText}
            maxLength={SignupConstants.FULLNAME_MAX_LENGTH}
          />
          <Label>Username</Label>
          <Input
            value={username}
            name='username'
            onChange={this.onChangeText}
            maxLength={SignupConstants.USERNAME_MAX_LENGTH}
          />
          { !!username && username.length < SignupConstants.USERNAME_MIN_LENGTH &&
            <ErrorText>Username must be at least {SignupConstants.USERNAME_MIN_LENGTH} characters long</ErrorText>
          }
          { !!error &&
            <ErrorText>Sorry, that username is already in use</ErrorText>
          }
          <Label>About</Label>
          <TextareaWrapper>
            <Textarea
              value={about}
              name='about'
              placeholder='Click to add About Me'
              onChange={this.onChangeText}
              rows={2}
              maxLength={63}
            />
          </TextareaWrapper>
          <Label>Bio</Label>
          <TextareaWrapper>
            <ResizableTextarea
              value={bio}
              name='bio'
              placeholder='Enter your bio'
              onChange={this.onChangeText}
              rows={bioLines > minRows ? bioLines : minRows}
              minRows={7}
              maxRows={500}
              textProps={ResizableTextareaStyles}
            />
          </TextareaWrapper>
        </InputsWrapper>

        <SaveCancelButtonWrapper>
            <SaveCancelButton
              margin='small'
              type={'blackWhite'}
              text={'CANCEL'}
              onClick={this.onCancel}
            />
            <SaveCancelButton
              margin='small'
              text='SAVE CHANGES'
              onClick={this.onSave}
              disabled={!username || (username.length < SignupConstants.USERNAME_MIN_LENGTH)}
            />
        </SaveCancelButtonWrapper>

        <Modal
          contentLabel='Edit Photo Options'
          isOpen={modal === 'editPhotoOptions'}
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <EditPhotoOptions
            onCrop={this.openCrop}
            onUpload={this.uploadImageToBrowser}
            hasLoadedImage={!!loadedImage}
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
            src={loadedImage ? loadedImage.uri : targetedImage}
          />
        </Modal>
      </Container>
    )
  }
}
