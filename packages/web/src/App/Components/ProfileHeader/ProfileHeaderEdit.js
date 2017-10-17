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

import {
  Username,
  ItalicText,
  Centered,
  StyledAvatar,
  AvatarWrapper,
  ButtonWrapper,
  BottomLeft,
  ContributorText,
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
      modal: 'photoEditor',
      bioText: 'Here is some random text',
      targetedPhoto: 'avatar',
    }
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openCoverOptions = () => {
    this.setState({
      modal: 'editPhotoOptions',
      targetedPhoto: 'cover'

    })
  }

  openAvatarOptions = () => {
    this.setState({
      modal: 'editPhotoOptions',
      targetedPhoto: 'avatar'
    })
  }

  onChangeText = (event) => {
    this.setState({ bioText: event.target.value })
  }

  openCrop = () => {
    this.setState({ modal: 'photoEditor'})
  }

  render () {
    const {user} = this.props
    const {modal, targetedPhoto, bioText} = this.state
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
              avatarUrl={getImageUrl(user.profile.avatar)}
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
              <ContributorText>EDIT COVER IMAGE</ContributorText>
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
            onClickCrop={this.openCrop}
          />
        </Modal>
        <Modal
          contentLabel='Photo Editor'
          isOpen={modal === 'photoEditor'}
          style={customModalStyles}
        >
          <PhotoEditor
            isAvatar={targetedPhoto === 'avatar'}
            closeModal={this.closeModal}
          />
        </Modal>
      </Container>
    )
  }
}
