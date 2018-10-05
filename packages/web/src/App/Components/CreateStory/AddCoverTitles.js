import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Overlay from '../Overlay'
import Icon from '../Icon'
import {SubTitle, Input, CloseXContainer} from './Shared'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import getVideoUrl from '../../Shared/Lib/getVideoUrl'
import uploadFile from '../../Utils/uploadFile'
import {VerticalCenterStyles} from '../VerticalCenter'
import Video from '../Video'

const ButtonsHorizontalCenter = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 350px;
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
  align-self: center;
  cursor: pointer;
`

const StoryOverlayWrapper = styled(Overlay)`
  margin: 40px auto 0;
  padding-top: 350px;
  width: 100%;
  max-width: 800px;
  max-height: 350px;
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
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.redHighlights};
`

const StyledIcon = styled(Icon)`
  height: 40px;
  width: 40px;
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
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 30px;
  }
`

const StyledSubTitleInput = styled(StyledInput)`
  text-align: left;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: .7px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
  }
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

const TitleInputsWrapper = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0px 15px;
  }
`

const StyledCloseXContainer = styled(CloseXContainer)`
  z-index: 1;
`

// we cannot use a button if we want the hiddenInput to work
// as such we have recreated the same styles as a button would
// so that it matches CloseX that is used for the body media
const CustonCloseX = styled.div`
  cursor: pointer;
  border-radius: 18px;
  border: 1px solid;
  border-color: ${props => props.theme.Colors.closeXBorder};
  margin: 3px;
  padding: 5px;
  background-color: ${props => props.theme.Colors.backgroundOpaque};
  width: 18px;
  height: 18px;
  &:hover {
    background-color: ${props => props.theme.Colors.backgroundOpaque};
  };
  ${VerticalCenterStyles}
`


function isNewStory(props, nextProps) {
  return (!props.workingDraft && nextProps.workingDraft) ||
  (props.workingDraft.id !== nextProps.workingDraft.id)

}

export default class AddCoverTitles extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func,
    workingDraft: PropTypes.object,
    isGuide: PropTypes.bool,
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
      let update = file.type.includes('video')
      ? {
        'coverVideo': file,
        'coverImage': null,
        'coverType': 'video'
      }
      : {
        'coverImage': file,
        'coverVideo': null,
        'coverType': 'image'
      }
      // refactor later to differentiate between image and video
      this.props.onInputChange(update)
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

  renderUploadButton() {
    const {isGuide} = this.props
    const coverImage = this.getCoverImage()
    const coverVideo = this.getCoverVideo()

    let acceptProp = 'image/*'
    let coverTypeText = 'COVER PHOTO'
    if (!isGuide) {
      acceptProp += ', video/*'
      coverTypeText += ' OR VIDEO'
    }

    if (coverImage || coverVideo) return (
      <ReplaceUploadWrapper htmlFor="cover_upload_replace">
        <StyledCloseXContainer>
          <CustonCloseX>
            <DeleteIcon
              size='small'
              name='close'
            />
          </CustonCloseX>
        </StyledCloseXContainer>
        <HiddenInput
          type='file'
          id='cover_upload_replace'
          name='coverImage'
          accept={acceptProp}
          onChange={this._onCoverChange}
        />
      </ReplaceUploadWrapper>
    )
    return (
      <NewUploadWrapper htmlFor='cover_upload'>
        <IconWrapper>
          <StyledIcon name='components'/>
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
        {!coverVideo &&
          <StoryOverlayWrapper image={coverImage}/>
        }
        {coverVideo &&
          <LimitedWidthContainer>
            <Video
              src={coverVideo}
              type={'cover'}
              withPrettyControls
            />
          </LimitedWidthContainer>
          }
        <Wrapper hasMediaAsset={hasMediaAsset}>
          <ButtonsHorizontalCenter>
            {this.renderUploadButton()}
          </ButtonsHorizontalCenter>
        </Wrapper>
        {hasMediaAsset && !isGuide &&
          <StyledCoverCaptionInput
            type='text'
            placeholder='Add Cover Caption'
            name='coverCaption'
            onChange={this._onTextChange}
            value={this.state.coverCaption}
            maxLength={100}
          />
        }
        {!hasMediaAsset && !isGuide && <CoverCaptionSpacer />}
        {!isGuide &&
          <TitleInputsWrapper>
            <StyledTitleInput
              type='text'
              placeholder='ADD TITLE'
              name='title'
              onChange={this._onTextChange}
              value={this.state.title}
              maxLength={40}
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
        }
      </RelativeWrapper>
    )
  }
}
