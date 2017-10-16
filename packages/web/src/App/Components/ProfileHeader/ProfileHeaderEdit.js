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
      modal: 'editPhoto',
      bioText: 'Here is some random text',
    }
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openModal = () => {
    this.setState({ modal: 'editPhoto'})
  }

  onChangeText = (event) => {
    this.setState({bioText: event.target.value})
  }

  render () {
    const {user} = this.props
    return (
      <Container>
        <Centered>
          <Username>{user.username}</Username>
          <AvatarWrapper>
            <EditAvatarWrapper>
              <CameraIcon
                name='camera'
                onClick={this.openModal}
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
            value={this.state.bioText}
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
            <Row>
              <CameraIcon name='camera'/>
              <ContributorText>EDIT COVER IMAGE</ContributorText>
            </Row>
          </BottomLeft>
        </Centered>
        <Modal
          isOpen={this.state.modal === 'editPhoto'}
          onRequestClose={this.closeModal}
          style={customModalStyles}
        >
          <EditPhotoOptions/>
        </Modal>
      </Container>
    )
  }
}
