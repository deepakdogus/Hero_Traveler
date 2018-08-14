import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import CloseX from '../CloseX'
import Overlay from '../Overlay'
import Icon from '../Icon'
import {SubTitle, Input, CloseXContainer} from './Shared'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import uploadFile from '../../Utils/uploadFile'
import {VerticalCenterStyles} from '../VerticalCenter'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  height: 350px;
  width: 100%;
  background-color: ${props =>
    props.hasImage ? props.theme.Colors.transparent : props.theme.Colors.lightGreyAreas
  };
  ${VerticalCenterStyles}
`

const RelativeWrapper = styled.div`
  position: relative;
`

const StoryOverlayWrapper = styled(Overlay)`
  margin-top: 40px;
  padding-top: 350px;
  width: 100%;
  max-width: 800px;
  max-height: 350px;
  background-image: ${props => `url(${props.image})`};
  background-size: cover;
  position: relative;
  z-index: -100;
`

const UploadWrapper = styled.label`
  width: 100%;
  cursor: pointer;
  ${VerticalCenterStyles}
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

const StyledInput = styled(Input)`;
  color: ${props => props.theme.Colors.grey};
  ::placeholder {
    color: ${props => props.theme.Colors.grey};
  }
`

const StyledTitleInput = styled(StyledInput)`
  margin-top: 10px;
  text-align: left;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 38px;
  font-weight: 700;
  line-height: 50px;
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.background};
  ::placeholder {
    color: ${props => props.theme.Colors.background};
  }
`

const StyledSubTitleInput = styled(StyledInput)`
  text-align: left;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: .7px;
`

const StyledCoverCaptionInput = styled(StyledInput)`
  background-color: transparent;
  font-size: 14px;
  font-style: italic;
  margin-top: 7px;
  width: 100%;
`

const CoverCaptionSpacer = styled.div`
  height: 27px;
`

const TitleInputsWrapper = styled.div``

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
    const coverImage = (workingDraft.coverImage && workingDraft.coverImage.uri) ? workingDraft.coverImage.uri : getImageUrl(workingDraft.coverImage)

    return (
      <RelativeWrapper>
        <StoryOverlayWrapper image={coverImage}/>
        <Wrapper hasImage={!!coverImage}>
          <UploadWrapper htmlFor='cover_upload'>
            <IconWrapper>
              <StyledIcon name='components'/>
            </IconWrapper>
            <IconSubTitle>
              {coverImage && "+ CHANGE COVER PHOTO OR VIDEO"}
              {!coverImage && "+ ADD A COVER PHOTO OR VIDEO"}
            </IconSubTitle>
            <HiddenInput
              type='file'
              id='cover_upload'
              name='coverImage'
              accept='image/*, video/*'
              onChange={this._onCoverChange}
            />
          </UploadWrapper>
        </Wrapper>
        {!!coverImage &&
          <StyledCoverCaptionInput
            type='text'
            placeholder='Add Cover Caption'
            name='coverCaption'
            onChange={this._onTextChange}
            value={this.state.coverCaption}
            maxLength={100}
          />
        }
        {!coverImage && <CoverCaptionSpacer />}
        {
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
        }
      </RelativeWrapper>
    )
  }
}
