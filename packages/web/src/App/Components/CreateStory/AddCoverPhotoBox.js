import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Overlay from '../Overlay'
import Icon from '../Icon'
import {SubTitle, Input} from './Shared'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import uploadFile from '../../Utils/uploadFile'

const Container = styled.div`
  position: absolute;
  top: 0;
  padding: 127.5px;
  background-color: ${props => props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.pink};
  border: 1px dashed ${props => props.hasImage ? 'none' : `1px dashed ${props.theme.Colors.redHighlights}`}
`

const RelativeContainer = styled.div`
  position: relative;
`

const StoryOverlayContainer = styled(Overlay)`
  margin-top: 40px;
  padding-top: 505px;
  width: 100%;
  max-width: 900px;
  max-height: 505px;
  background-image: ${props => `url(${props.image})`};
  background-size: cover;
  position: relative;
  z-index: -100;
`

const IconSubTitle = styled(SubTitle)`
  font-weight: 400;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.redHighlights}
`

const StyledIcon = styled(Icon)`
  height: 40px;
  width: 40px;
  margin-top: 10px;
`

const IconContainer = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const StyledTitleInput = styled(Input)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  background-color: ${props => props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.pink};
  font-size: 50px;
  margin-top: ${props => `${props.hasImage ? 158 : 46}px`};
  letter-spacing: 1.5px;
  ::-webkit-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  :-ms-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  ::-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
  :-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
`

const StyledSubTitleInput = styled(Input)`
  background-color: ${props => props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.pink};
  font-size: 20px;
  ::-webkit-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  :-ms-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  ::-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
  :-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
`

const TitleInputsContainer = styled.div`
  text-align: center;
  background-color: inherit;
`

function isNewStory(props, nextProps) {
  return (!props.workingDraft && nextProps.workingDraft) ||
  (props.workingDraft.id !== nextProps.workingDraft.id)

}

export default class AddCoverPhotoBox extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func,
    workingDraft: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.workingDraft.title || '',
      description: props.workingDraft.description || '',
    }
  }

  _onCoverChange = (event) => {
    const { onInputChange } = this.props
    uploadFile(event, this, (file) => {
      onInputChange({
        target: {
          value: file,
          name: 'tempCover'
        }
      })
      // refactor later to differentiate between image and video
      onInputChange({
        target: {
          value: 'image',
          name: 'coverType'
        }
      })
    })
  }

  _onTextChange = (event) => {
    this.props.onInputChange(event)
    /*
    React was angry at us setting input value to workingDraft.title so we are
    no having simultaneous local object. Will try to revise later
    */
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // add this to properly set the value of the titleInput
  componentWillReceiveProps(nextProps) {
    const workingDraft = {nextProps}
    if (isNewStory(this.props, nextProps)){
      this.setState({
        title: workingDraft.title,
        description: workingDraft.title,
      })
    }
  }


  render() {
    const {workingDraft} = this.props
    const coverImage = workingDraft.tempCover ? workingDraft.tempCover.url : getImageUrl(workingDraft.coverImage)
    return (
      <RelativeContainer>
        <StoryOverlayContainer image={coverImage}/>
        <Container hasImage={!!coverImage}>
          {!coverImage &&
            <label htmlFor='cover_upload'>
              <IconContainer>
                <StyledIcon name='components'/>
              </IconContainer>
              <IconSubTitle>+ ADD A COVER PHOTO</IconSubTitle>
              <HiddenInput
                type='file'
                id='cover_upload'
                name='tempCover'
                onChange={this._onCoverChange}
              />
            </label>
          }
          <TitleInputsContainer>
            <StyledTitleInput
              type='text'
              placeholder='ADD TITLE'
              name='title'
              onChange={this._onTextChange}
              value={this.state.title}
              maxLength={40}
              hasImage={!!coverImage}
            />
            <StyledSubTitleInput
              type='text'
              placeholder='Add a subtitle'
              name='description'
              onChange={this._onTextChange}
              value={this.state.description}
              maxLength={50}
              hasImage={!!coverImage}
            />
          </TitleInputsContainer>
        </Container>
      </RelativeContainer>
    )
  }
}
