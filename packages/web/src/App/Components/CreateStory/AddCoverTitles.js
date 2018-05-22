import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import CloseX from '../CloseX'
import Overlay from '../Overlay'
import Icon from '../Icon'
import {SubTitle, Input, CloseXContainer} from './Shared'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import uploadFile from '../../Utils/uploadFile'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  padding: 127.5px 30px;
  background-color: ${props => props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.pink};
  border: 1px dashed ${props => props.hasImage ? 'none' : `1px dashed ${props.theme.Colors.redHighlights}`};
`

const RelativeWrapper = styled.div`
  position: relative;
`

const StoryOverlayWrapper = styled(Overlay)`
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

const UploadWrapper = styled.label`
  position: absolute;
  width: 100%;
  margin-left: -30px;
`
const IconSubTitle = styled(SubTitle)`
  font-weight: 400;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.redHighlights};
`

const StyledIcon = styled(Icon)`
  height: 40px;
  width: 40px;
  margin-top: 10px;
`

const IconWrapper = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const StyledInput = styled(Input)`
  background-color: ${props => props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.pink};
  ::placeholder {
    color: ${props => props.theme.Colors.background};
  }
`

const StyledTitleInput = styled(StyledInput)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 50px;
  margin-top: ${props => `${props.hasImage ? 158 : 46}px`};
  letter-spacing: 1.5px;
  width: 100%;
`

const StyledSubTitleInput = styled(StyledInput)`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 20px;
`

const StyledCoverCaptionInput = styled(StyledInput)`
  background-color: transparent;
  font-size: 14px;
  font-style: italic;
  margin-top: 7px;
  width: 100%;
`

const TitleInputsWrapper = styled.div`
  text-align: center;
  background-color: inherit;
`

function isNewStory(props, nextProps) {
  return (!props.workingDraft && nextProps.workingDraft) ||
  (props.workingDraft.id !== nextProps.workingDraft.id)

}

export default class AddCoverTitles extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func,
    workingDraft: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.workingDraft.title || '',
      description: props.workingDraft.description || '',
      coverCaption: props.workingDraft.coverCaption || '',
    }
  }

  _onCoverChange = (event) => {
    uploadFile(event, this, (file) => {
      // refactor later to differentiate between image and video
      this.props.onInputChange({
        'coverImage': file,
        'coverType': 'image',
      })
    })
  }

  _onCoverRemove = (event) => {
    this.props.onInputChange({
      'coverImage': undefined,
    })
  }

  _onTextChange = (event) => {
    this.props.onInputChange({
      [event.target.name]: event.target.value,
    })
    /*
    React was angry at us setting input value to workingDraft.title so we now
    have an identical local state. Will try to revise later
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
    const coverImage = workingDraft.coverImage ? workingDraft.coverImage.url : getImageUrl(workingDraft.coverImage)
    return (
      <RelativeWrapper>
        <StoryOverlayWrapper image={coverImage}/>
        <Wrapper hasImage={!!coverImage}>
          <UploadWrapper htmlFor='cover_upload'>
            <IconWrapper>
              <StyledIcon name='components'/>
            </IconWrapper>
            <IconSubTitle>
              {coverImage && "+ CHANGE COVER PHOTO"}
              {!!coverImage && "+ ADD A COVER PHOTO"}
            </IconSubTitle>
            <HiddenInput
              type='file'
              id='cover_upload'
              name='coverImage'
              onChange={this._onCoverChange}
            />
          </UploadWrapper>
          <TitleInputsWrapper>
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
          </TitleInputsWrapper>
        </Wrapper>
        { !!coverImage && <StyledCoverCaptionInput
            type='text'
            placeholder='Add Cover Caption'
            name='coverCaption'
            onChange={this._onTextChange}
            value={this.state.coverCaption}
            maxLength={100}
          />
        }
      </RelativeWrapper>
    )
  }
}
