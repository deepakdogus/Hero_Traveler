import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Row, Col} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import VerticalCenter from '../VerticalCenter'
import Modal from 'react-modal'
import EditPhotoOptions from '../Modals/EditPhotoOptions'
import PhotoEditor from '../Modals/PhotoEditor'
import uploadFile from '../../Utils/uploadFile'
import {Constants as SignupConstants} from '../Modals/HeaderModals/Signup'

import {
  UsernameBaseStyles,
  Centered,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
} from './ProfileHeaderShared'

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
  }
}

const CameraIcon = styled(Icon)`
  width: 31px;
  height: 24px;
`

const PencilIcon = styled(Icon)`
  width: 35px;
  height: 35px;
  margin: 10px 0;
`

const EditAvatarWrapper = styled(VerticalCenter)`
  position: absolute;
  align-items: center;
  width: 100%;
  height: 100%;
`

const BioInput = styled.textarea`
  color: ${props => props.theme.Colors.grey};
  font-size: 16px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  width: 100%;
  height: 160px;
  resize: none;
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  border-width: 0px;
  padding: 0;
`

const Container = styled.div``

const ProfileEditCentered = styled(Centered)`
  height: 320px;
`

const SecondCol = styled(Col)`
  margin-left: 20px;
`

const UsernameWrapper = styled(VerticalCenter)``

const EditBioText = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 700;
  color: ${props => props.theme.Colors.background};
  padding: 30px 0 10px;
  margin: 0;
`
const AboutWrapper = styled(VerticalCenter)``

const EditAboutText = styled.text`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  color: ${props => props.theme.Colors.background};
  padding: 10px 0 10px 5px;
  margin: 0;
  font-size: 18px;
  text-align: left;
`
const AboutInput = styled.textarea`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  color: ${props => props.theme.Colors.grey};
  padding: 5px;
  margin: 0;
  font-size: 18px;
  letter-spacing: .7px;
  text-align: left;
  background-color: transparent;
  border-width: 0px;
  resize: none;
  width: 450px;
`

const BioWrapper = styled.div`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
`

const BioContainer = styled.div`
  max-width: 800px;
  margin: auto;
`

const UsernameInput = styled.input`
  ${UsernameBaseStyles};
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  color: ${props => props.theme.Colors.background};
  width: 250px;
  border-width: 0;
  padding-left: 5px;
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
function getInitialState(user = {}){
  return {
    bio: user.bio,
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
  }

  constructor(props) {
    super(props)
    this.state = getInitialState(props.user)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.user.id !== this.props.user.id) {
      this.setState({
        bio: nextProps.user.bio,
        username: nextProps.user.username
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
      photoType: type
    })
  }

  openCoverOptions = () => {
    this.setOptionsState('userCover')
  }

  openAvatarOptions = () => {
    this.setOptionsState('avatar')
  }

  onChangeText = (event) => {
    this.setState({ [event.target.name]: event.target.value })
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
    })

  }

  render () {
    const {user, error} = this.props
    const {bio, loadedImage, modal, photoType, username, about} = this.state
    const avatarUrl = getImageUrl(user.profile.avatar, 'avatar')
    let targetedImage
    if (photoType === 'avatar') targetedImage = avatarUrl
    else if (photoType === 'userCover') targetedImage = getImageUrl(user.profile.cover)
    return (
      <Container>
        <ProfileEditCentered>
          <Row center='xs'>
            <Col>
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
            </Col>
            <SecondCol>
              <UsernameWrapper>
                <Row>
                  <Col>
                    <UsernameInput
                      value={username}
                      name='username'
                      onChange={this.onChangeText}
                      maxLength={SignupConstants.USERNAME_MAX_LENGTH}
                    />
                    { username && username.length < SignupConstants.USERNAME_MIN_LENGTH &&
                      <ErrorText>Username must be at least 2 characters long</ErrorText>
                    }
                    { error &&
                      <ErrorText>Sorry, that username is already in use</ErrorText>
                    }
                  </Col>
                  <PencilIcon
                    name='pencilBlack'
                  />
                </Row>
              </UsernameWrapper>
              <AboutWrapper>
                <EditAboutText>Edit About</EditAboutText>
                  <AboutInput
                    value={about}
                    name='about'
                    placeholder='Click to add About Me'
                    onChange={this.onChangeText}
                    rows={2}
                    maxLength={63}
                  />
              </AboutWrapper>
            </SecondCol>
          </Row>
        </ProfileEditCentered>

        <BioWrapper>
          <BioContainer>
            <EditBioText>Edit Bio</EditBioText>
            <BioInput
              value={bio}
              name='bio'
              placeholder='Enter your bio'
              onChange={this.onChangeText}
            />
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
          </BioContainer>
        </BioWrapper>

        <Modal
          contentLabel='Edit Photo Options'
          isOpen={modal === 'editPhotoOptions'}
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <EditPhotoOptions
            onCrop={this.openCrop}
            onUpload={this.uploadImageToBrowser}
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
            src={loadedImage ? loadedImage.uri : targetedImage}
          />
        </Modal>
      </Container>
    )
  }
}
