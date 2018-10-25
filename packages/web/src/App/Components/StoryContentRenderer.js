/* eslint-disable react/display-name */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import redraft from 'redraft'
import _ from 'lodash'

import Image from './Image'
import Video from './Video'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { getVideoUrlBase } from '../Shared/Lib/getVideoUrl'
import Caption from './MediaCaption'

const ContentContainer = styled.div``

const StyledImage = styled(Image)`
  width: 100%;
`

export const BodyText = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.6px;
`

const HeaderOne = styled.h1`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  &:first-letter {
    text-transform: uppercase;
  }
`

const Spacer = styled.div`
  width: 100%;
  height: 30px;
`

Spacer.defaultProps = {
  spacer: true,
}

const StyledStrong = styled.strong`
  font-weight: 600;
`

const inline = {
  BOLD: (children, { key }) => <StyledStrong key={key}>{children}</StyledStrong>,
  ITALIC: (children, { key }) => <em key={key}>{children}</em>,
  UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
}

const getAtomic = (children, { data, keys }) => {
  /*
    this seems a pretty precarious to get the text.
    TODO: See if we can find a better way to isolate the text
  */
  return data.map((media, index) => {
    const type = media.type
    const mediaUrl =
      type === 'image'
        ? getImageUrl(media.url, 'contentBlock')
        : `${getVideoUrlBase()}/${media.url}`
    const text = _.get(children, `[${index}][1][0]`, '').trim()
    switch (media.type) {
      case 'image':
        return [
          <Spacer key={0} />,
          <div key={keys[index]}>
            <StyledImage src={mediaUrl} />
            {text && <Caption>{text}</Caption>}
          </div>,
          <Spacer key={1} />,
          <Spacer key={2} />,
        ]
      case 'video':
        return [
          <Spacer key={0} />,
          <div key={keys[index]}>
            <Video src={mediaUrl} withPrettyControls />
            {text && <Caption>{text}</Caption>}
          </div>,
          <Spacer key={1} />,
          <Spacer key={2} />,
        ]
      default:
        return null
    }
  })
}

// only actually using unstyled - atomic - header-one
const blocks = {
  unstyled: (children, { keys }) =>
    children.map((child, i) => [<BodyText key={keys[i]}>{child}</BodyText>, <Spacer key={1} />]),
  atomic: getAtomic,
  blockquote: (children, { keys }) => <blockquote key={keys[0]}>{children}</blockquote>,
  'header-one': (children, { keys }) =>
    children.map((child, i) => [<HeaderOne key={keys[i]}>{child}</HeaderOne>, <Spacer key={1} />]),
  'header-two': (children, { keys }) => children.map((child, i) => <h2 key={keys[i]}>{child}</h2>),
  'header-three': (children, { keys }) =>
    children.map((child, i) => <h3 key={keys[i]}>{child}</h3>),
  'header-four': (children, { keys }) => children.map((child, i) => <h4 key={keys[i]}>{child}</h4>),
  'header-five': (children, { keys }) => children.map((child, i) => <h5 key={keys[i]}>{child}</h5>),
  'header-six': (children, { keys }) => children.map((child, i) => <h6 key={keys[i]}>{child}</h6>),
}

const entities = {
  LINK: (children, entity, { key }) => (
    <a key={key} href={entity.url}>
      {children}
    </a>
  ),
}

const options = {
  cleanup: {
    after: 'all',
    types: 'all',
    split: true,
  },
}

export default class StoryContentRenderer extends React.Component {
  static propTypes = {
    story: PropTypes.object,
  }

  trimSpacers = contentBlocks => {
    if (!contentBlocks) return null
    if (!contentBlocks.length) return contentBlocks

    const lastBlock = contentBlocks[contentBlocks.length - 1][0]

    while (
      lastBlock.length > 1
      && _.get(lastBlock, `[${lastBlock.length - 1}].props.spacer`)
    ) {
      lastBlock.pop()
    }

    contentBlocks[contentBlocks.length - 1] = lastBlock
    return contentBlocks
  }

  render() {
    const { story } = this.props
    if (!story.draftjsContent) return null

    const contentBlocks = this.trimSpacers(
      redraft(story.draftjsContent, { inline, blocks, entities }, options),
    )

    return <ContentContainer>{contentBlocks}</ContentContainer>
  }
}
