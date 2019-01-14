import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {
  SubTitle,
  Input,
  CloseXContainer,
} from './Shared'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import uploadFile, {
  getAcceptedFormats,
} from '../../Utils/uploadFile'
import { VerticalCenterStyles } from '../VerticalCenter'
import Video from '../Video'
import Loader from '../Loader'
import { Row } from '../FlexboxGrid'

const coverHeight = 350

const ButtonsHorizontalCenter = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: ${coverHeight}px;
  margin: auto;
  ${VerticalCenterStyles}
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  background-color: ${props =>
    props.hasMediaAsset ? props.theme.Colors.transparent : props.theme.Colors.lightGreyAreas
  };
`
const LimitedWidthContainer = styled.div`
  max-height: 600px;
  max-width: 800px;
  margin: 0 auto;
`

const RelativeWrapper = styled.div`
  position: relative;
`

const DeleteIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  align-self: center;
  cursor: pointer;
`

const ImageWrapper = styled.div`
  margin: 40px auto 0;
  padding-top: ${coverHeight}px;
  width: 100%;
  max-width: 800px;
  max-height: ${coverHeight}px;
  background-image: ${props => `url(${props.image})`};
  background-size: cover;
  position: relative;
  z-index: -100;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 20px auto 0;
  }
`

const NewUploadWrapper = styled.label`
  width: 100%;
  cursor: pointer;
  ${VerticalCenterStyles}
`

const ReplaceUploadWrapper = styled.label``

const IconSubTitle = styled(SubTitle)`
  font-weight: 400;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.redHighlights};
`

const StyledIcon = styled(Icon)`
  height: 70px;
  width: 70px;
  margin-top: 10px;
  cursor: pointer;
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
  padding: 0;
  color: ${props => props.theme.Colors.grey};
  ::placeholder {
    color: ${props => props.theme.Colors.grey};
  }
`

const StyledTitleTextArea = styled.textarea`
  width: 100%;
  padding: 0;
  resize: none;
  outline: none;
  border: none;
  text-align: left;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 38px;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.background};
  ::placeholder {
    color: ${props => props.theme.Colors.background};
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 30px;
  }
`

const StyledSubTitleInput = styled(StyledInput)`
  text-align: left;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: .2px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
  }
`

const StyledCoverCaptionInput = styled(StyledInput)`
  background-color: transparent;
  font-size: 14px;
  font-weight: 300;
  font-style: italic;
  width: 100%;
  height: 27px;
  margin: 20px 0;
`

const CoverCaptionSpacer = styled.div`
  height: 67px;
`

const TitleInputsWrapper = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0px 15px;
  }
`

const StyledCloseXContainer = styled(CloseXContainer)`
  z-index: 1;
`

const StyledRow = styled(Row)`
  position: absolute;
  z-index: -101;
  width: 100%;
  height: ${coverHeight}px;
`

function isNewStory(props, nextProps) {
  return (!props.workingDraft && nextProps.workingDraft) ||
  (props.workingDraft.id !== nextProps.workingDraft.id)
}

export default class AddCoverTitles extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func,
    uploadImage: PropTypes.func,
    workingDraft: PropTypes.object,
    isGuide: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.workingDraft.title || '',
      description: props.workingDraft.description || '',
      coverCaption: props.workingDraft.coverCaption || '',
      textAreaHeight: { height: '50px'},
      textAreaBreakCharIdx: 0,
    }

    this.textAreaRef = null
  }

  _setTextAreaRef = (ref) => this.textAreaRef = ref

  _onCoverChange = (event) => {
    uploadFile(event, this, (file) => {
      if (!file) return
      if (file.type.includes('video')) {
        this.props.onInputChange({
          'coverVideo': file,
          'coverImage': null,
          'coverType': 'video',
        })
      }
      else {
        const onSuccess = (cloudinaryFile) => {
          this.props.onInputChange({
            'coverVideo': null,
            'coverImage': cloudinaryFile,
            'coverType': 'image',
          })
        }
        this.props.uploadImage(file.uri, onSuccess)
      }
    })
  }

  removeCover = (event) => {
    this.props.onInputChange({
      'coverImage': undefined,
      'coverVideo': undefined,
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
      [event.target.name]: event.target.value,
    })
  }

  _onTextAreaTextChange = (event) => {
    /*
    Disallow new lines in textAreas. There's no access to keyCode in onChange
    handler, so checking newline value of newest char instead
    */
    if (event.target.value.charCodeAt(event.target.value.length - 1) === 10) {
      return
    }

    // set line break index so deleting first char of a newline reduces height
    const textAreaBreakCharIdx =
      this.state.textAreaHeight.height !== `${this.textAreaRef.scrollHeight}px`
        ? this.state.title.length + 1
        : this.state.textAreaBreakCharIdx

    const textAreaHeight =
      event.target.value.length >= this.state.title.length ||
      event.target.value.length >= this.state.textAreaBreakCharIdx
        ? { height: `${this.textAreaRef.scrollHeight}px` }
        : { height: `${this.textAreaRef.scrollHeight - 50 || 50}px` }

    this.setState({
      textAreaHeight,
      textAreaBreakCharIdx,
    })

    this._onTextChange(event)
  }

  componentWillReceiveProps(nextProps) {
    const { workingDraft } = nextProps
    this.setState({
      title: workingDraft.title,
      description: workingDraft.description,
    })
  }

  renderUploadButton() {
    const {isGuide} = this.props
    const coverImage = this.getCoverImage()
    const coverVideo = this.getCoverVideo()

    let acceptProp = getAcceptedFormats('image')
    let coverTypeText = 'COVER PHOTO'
    if (!isGuide) {
      acceptProp = getAcceptedFormats('both')
      coverTypeText += ' OR VIDEO'
    }

    if (coverImage || coverVideo) return (
      <ReplaceUploadWrapper htmlFor="cover_upload_replace">
        <StyledCloseXContainer>
          <DeleteIcon
            size='small'
            name='closeBlack'
            onClick={this.removeCover}
          />
        </StyledCloseXContainer>
      </ReplaceUploadWrapper>
    )
    return (
      <NewUploadWrapper htmlFor='cover_upload'>
        <IconWrapper>
          <StyledIcon name='createAddCover'/>
        </IconWrapper>
        <IconSubTitle>
          {coverImage && `+ CHANGE ${coverTypeText}`}
          {!coverImage && `+ ADD A ${coverTypeText}`}
        </IconSubTitle>
        <HiddenInput
          type='file'
          id='cover_upload'
          name='coverImage'
          accept={acceptProp}
          onChange={this._onCoverChange}
        />
      </NewUploadWrapper>
    )
  }

  getCoverImage() {
    const {workingDraft} = this.props
    return workingDraft.coverImage && workingDraft.coverImage.uri
    ? workingDraft.coverImage.uri
    : getImageUrl(workingDraft.coverImage)
  }

  getCoverVideo() {
    const { workingDraft } = this.props
    return workingDraft.coverVideo && workingDraft.coverVideo.uri
    ? workingDraft.coverVideo.uri
    : getVideoUrl(workingDraft.coverVideo, false)
  }

  render() {
    const {isGuide} = this.props
    const coverImage = this.getCoverImage()
    const coverVideo = this.getCoverVideo()
    const hasMediaAsset = !!coverImage || !!coverVideo

    return (
      <RelativeWrapper>
        <StyledRow center="xs">
          <Loader />
        </StyledRow>
        {!coverVideo && (
          <ImageWrapper image={coverImage}/>
        )}
        {coverVideo && (
          <LimitedWidthContainer>
            <Video
              src={coverVideo}
              type={'cover'}
              onError={this.removeCover}
              withPrettyControls
            />
          </LimitedWidthContainer>
        )}
        <Wrapper hasMediaAsset={hasMediaAsset}>
          <ButtonsHorizontalCenter>
            {this.renderUploadButton()}
          </ButtonsHorizontalCenter>
        </Wrapper>
        {hasMediaAsset && !isGuide && (
          <StyledCoverCaptionInput
            type='text'
            placeholder='Add a caption'
            name='coverCaption'
            onChange={this._onTextChange}
            value={this.state.coverCaption}
            maxLength={100}
          />
        )}
        {!hasMediaAsset && !isGuide && <CoverCaptionSpacer />}
        {!isGuide && (
          <TitleInputsWrapper>
            <StyledTitleTextArea
              type='text'
              placeholder='Add Title'
              name='title'
              onChange={this._onTextAreaTextChange}
              value={this.state.title}
              innerRef={this._setTextAreaRef}
              style={this.state.textAreaHeight}
              maxLength={40}
              rows={1}
              hasMediaAsset={hasMediaAsset}
            />
            <StyledSubTitleInput
              type='text'
              placeholder='Add a subtitle'
              name='description'
              onChange={this._onTextChange}
              value={this.state.description}
              maxLength={50}
              hasMediaAsset={hasMediaAsset}
            />
          </TitleInputsWrapper>
        )}
      </RelativeWrapper>
    )
  }
}
