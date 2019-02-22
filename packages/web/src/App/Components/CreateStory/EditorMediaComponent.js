import React from 'react'
import PropTypes from 'prop-types'
import {
  EditorBlock,
} from 'draft-js'
import styled from 'styled-components'
import cx from 'draft-js/node_modules/fbjs/lib/cx'

import getImageUrl from '../../Shared/Lib/getImageUrl'
import { getBodyVideoUrls } from '../../Shared/Lib/getVideoUrl'
import Image from '../Image'
import Video from '../Video'
import { CloseXContainer } from './Shared'
import CloseX from '../CloseX'
import Placeholder from './EditorCustomPlaceholder'
import Caption from '../MediaCaption'
import Loader from '../Loader'
import {Row} from '../FlexboxGrid'

const MediaWrapper = styled.div`
  padding-bottom: 60px;
`

const BodyMediaDiv = styled.div`
  position: relative;
  min-height: 100px;
`

const StyledImage = styled(Image)`
  width: 100%;
`

const StyledRow = styled(Row)`
  position: absolute;
  z-index: -1;
  width: 100%;
  top: -20px;
`

const CenteredRow = styled(Row)`
  width: 100%;
`

export default class MediaComponent extends EditorBlock {
  static propTypes = {
    offsetKey: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    direction: PropTypes.string,
  }

  componentWillMount = () => {
    const {url} = this.props.blockProps
    if (!url) this.onClickDelete()
  }

  onClickDelete = () => {
    const {key , onClickDelete} = this.props.blockProps
    onClickDelete(key, this.props.block.getLength())
  }

  setErrorState = () => this.setState({error: 'Failed to load asset'})

  getMediaComponent() {
    let {type, key, url} = this.props.blockProps

    if (type === 'image') {
      return (
        <BodyMediaDiv key={key}>
          <CloseXContainer>
            <CloseX
              onClick={this.onClickDelete}
            />
          </CloseXContainer>
          <StyledRow center="xs">
            <Loader />
          </StyledRow>
          <StyledImage
            src={getImageUrl(url, 'contentBlock')}
            onLoad={this.setImageLoaded}
          />
        </BodyMediaDiv>
      )
    }
    else if (type === 'video') {
      return (
        <BodyMediaDiv key={key}>
          <CloseXContainer>
            <CloseX
              onClick={this.onClickDelete}
            />
          </CloseXContainer>
          <Video
            {...getBodyVideoUrls(url)}
            withPrettyControls
            onError={this.onClickDelete}
          />
        </BodyMediaDiv>
      )
    }
    return null
  }

  render() {
    const {offsetKey, direction} = this.props
    const {text, type, url} = this.props.blockProps
    const className = cx({
      'public/DraftStyleDefault/block': true,
      'public/DraftStyleDefault/ltr': direction === 'LTR',
      'public/DraftStyleDefault/rtl': direction === 'RTL',
    })

    if (type === 'loader') {
      return (
        <MediaWrapper
          data-offset-key={offsetKey}
          className={className}
        >
          <CenteredRow center="xs">
            <Loader />
          </CenteredRow>
        </MediaWrapper>
      )
    }

    if (!url) {
      return (
        <div
          data-offset-key={offsetKey}
          className={className}
        />
      )
    }

    return (
      <MediaWrapper
        data-offset-key={offsetKey}
        className={className}
      >
        {this.getMediaComponent()}
        {!text && <Placeholder text='Add a caption'/>}
        <Caption>
          {this._renderChildren()}
        </Caption>
      </MediaWrapper>
    )
  }
}
