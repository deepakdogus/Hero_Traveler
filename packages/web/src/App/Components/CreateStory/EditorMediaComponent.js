import React from 'react'
import PropTypes from 'prop-types'
import {
  EditorBlock,
} from 'draft-js'
import styled from 'styled-components'


import getImageUrl from '../../Shared/Lib/getImageUrl'
import {getVideoUrlBase} from '../../Shared/Lib/getVideoUrl'
import Image from '../Image'
import Video from '../Video'
import {CloseXContainer} from './Shared'
import CloseX from '../CloseX'
import Placeholder from './EditorCustomPlaceholder'
import Caption from '../MediaCaption'
import Loader from '../Loader'
import {Row} from '../FlexboxGrid'

const cx = require('draft-js/node_modules/fbjs/lib/cx');

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

  getMediaUrl() {
    const {type, url} = this.props.blockProps
    if (url.startsWith('data:')) return url
    else if (type === 'image') return getImageUrl(url, 'contentBlock')
    else if (type === 'video') return `${getVideoUrlBase()}/${url}`
  }

  getMediaComponent() {
    let {type, key} = this.props.blockProps

    const mediaUrl = this.getMediaUrl()
    switch (type) {
      case 'image':
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
              src={mediaUrl}
              onLoad={this.setImageLoaded}
            />
          </BodyMediaDiv>
        )
      case 'video':
        return (
          <BodyMediaDiv key={key}>
            <CloseXContainer>
              <CloseX
                onClick={this.onClickDelete}
              />
            </CloseXContainer>
            <Video
              src={mediaUrl}
              withPrettyControls
              onError={this.onClickDelete}
            />
          </BodyMediaDiv>
        )
      default:
        return null
    }
  }

  render() {
    const {offsetKey, direction} = this.props
    const {text} = this.props.blockProps
    const className = cx({
      'public/DraftStyleDefault/block': true,
      'public/DraftStyleDefault/ltr': direction === 'LTR',
      'public/DraftStyleDefault/rtl': direction === 'RTL',
    })

    const {url} = this.props.blockProps
    if (!url) return <div data-offset-key={offsetKey} className={className}/>

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
