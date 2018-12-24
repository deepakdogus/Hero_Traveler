import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from 'react-modal'
import PhotoEditor from '../Modals/PhotoEditor'
import VerticalCenter from '../VerticalCenter'
import { Row } from '../FlexboxGrid'
import {
  StyledAvatar,
  ButtonWrapper,
} from './ProfileHeaderShared'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import ResizableTextarea from '../ResizableTextarea'

import { FieldConstraints as SignupConstants } from '../../Shared/Lib/userFormValidation'
import uploadFile, { getAcceptedFormats } from '../../Utils/uploadFile'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import _ from 'lodash'

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
  cursor: pointer;
`

const EditAvatarWrapper = styled(VerticalCenter)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1;

  cursor: pointer;
`

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
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

const UpdateAvatarText = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  letter-spacing: .2px;
  font-size: 18px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100%;
  }
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

const AvatarLabel = styled.label`
  position: relative;
  left: 6px;
  height: 140px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 100px;
  }
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

const responsiveAvatarStyles = `
  width: 100px;
  height: 100px;
`

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.background};
  margin-left: 7.5px;
  margin-right: 7.5px;
  margin-top: 2px;
  height: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const UpdateAvatarRow = styled(Row)`
  padding-left: 20px;
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
    removeAvatar: PropTypes.func,
    uploadMedia: PropTypes.func,
    uploadImage: PropTypes.func,
    toProfileView: PropTypes.func,
    updating: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = getInitialState(props.user)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.id !== this.props.user.id) {
      this.setState({
        bio: this.props.user.bio,
        username: this.props.user.username,
      })
    }

    const didSave =
      !!prevProps.updating
      && !this.props.updating
      && !this.props.error

    // If save was successful, reroute, except when avatar image changes
    if (
      didSave
      & _.isEqual(this.props.user.profile.avatar, prevProps.user.profile.avatar)
    ) {
      this.props.toProfileView()
    }
  }

  closeModal = () => {
    this.setState({
      modal: undefined,
      loadedImage: undefined,
    })
  }

  onChangeText = (event) => {
    let newText = event.target.value

    if (event.target.name === 'about') {
      // trim new lines
      newText = newText.replace(/\n|\r/g, '')
    }

    this.setState({ [event.target.name]: newText })
  }

  // add backend logic later
  saveCroppedImage = async (croppedImageUrl) => {
    // formatting into blob for upload
    const res = await fetch(croppedImageUrl)
    this.props.uploadMedia(
      this.props.user.id,
      res,
      this.state.photoType,
    )
    const stateUpdates = { modal: undefined }
    stateUpdates[this.state.photoType] = croppedImageUrl
    this.setState(stateUpdates)
  }

  removeAvatar = () => {
    this.props.removeAvatar(this.props.user.id)
  }

  uploadImageToBrowser = (event) => {
    uploadFile(event, this, (file) => {
      if (!file) return
      const onSuccess = (cloudinaryFile) => {
        this.setState({
          loadedImage: cloudinaryFile,
          photoType: 'avatar',
          modal: 'photoEditor',
        })
      }
      this.props.uploadImage(file.uri, onSuccess)
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
      'profile.fullName': this.state.fullname,
    })
  }

  render () {
    const {user, error} = this.props
    const {
      bio,
      loadedImage,
      modal,
      photoType,
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

    if (photoType === 'avatar' && !!loadedImage) {
      targetedImage = getImageUrl(loadedImage)
    }
    else if (photoType === 'avatar') targetedImage = avatarUrl

    const avatarIsClickable = () => true

    return (
      <Container>
        <RelativeWrapper>
          <AvatarLabel htmlFor='image_upload'>
            <StyledAvatar
              avatarUrl={avatarUrl}
              type='profile'
              size='x-large'
              responsiveProps={responsiveAvatarStyles}
              onClick={avatarIsClickable}
            >
            </StyledAvatar>
              <EditAvatarWrapper>
              <CameraIcon
                type='avatar'
                name='camera'
              />
            </EditAvatarWrapper>
            </AvatarLabel>
          <VerticalCenter>
            <UpdateAvatarRow>
            <label htmlFor='image_upload'>
              <UpdateAvatarText>
                {`${avatarUrl ? 'Update' : 'Upload'} profile picture`}
              </UpdateAvatarText>
            </label>
            {avatarUrl && <Divider>&nbsp;</Divider>}
            {avatarUrl &&
              <UpdateAvatarText onClick={this.removeAvatar}>
                Remove
              </UpdateAvatarText>
            }
            </UpdateAvatarRow>
          </VerticalCenter>
          <HiddenInput
            type='file'
            id='image_upload'
            onChange={this.uploadImageToBrowser}
            accept={getAcceptedFormats('image')}
          />
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
          contentLabel='Photo Editor'
          isOpen={modal === 'photoEditor'}
          style={customModalStyles}
        >
          <PhotoEditor
            isAvatar={photoType === 'avatar'}
            closeModal={this.closeModal}
            saveCroppedImage={this.saveCroppedImage}
            src={targetedImage}
          />
        </Modal>
      </Container>
    )
  }
}
