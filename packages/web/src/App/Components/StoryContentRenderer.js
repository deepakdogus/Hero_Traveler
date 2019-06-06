/* eslint-disable react/display-name */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import redraft from 'redraft'
import _ from 'lodash'

import Image from './Image'
import Video from './Video'
import getImageUrl from '../Shared/Lib/getImageUrl'
import { getBodyVideoUrls } from '../Shared/Lib/getVideoUrl'
import Caption from './MediaCaption'

const LINK_ROLES = ['admin', 'brand', 'founding Member']
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
  word-break: break-all;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`

const HeaderOne = styled.h1`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.2px;
  &:first-letter {
    text-transform: uppercase;
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`

const Spacer = styled.div`
  width: 100%;
  height: 30px;
`

Spacer.defaultProps = {
  spacer: true,
}

// some sites may nest elements inside anchor tags that contain their own styles
// targeting the children attempts to apply a single flat style to entire pasted link
const StyledLink = styled.a`
  font-weight: 600;
  color: ${props => props.theme.Colors.redHighlights};
  text-decoration: none;
  font-style: normal;
  cursor: pointer;
  > u,
  * {
    text-decoration: none;
    font-style: normal;
  }
`

const StyledStrong = styled.strong`
  font-weight: 600;
  text-decoration: none;
  > u,
  * {
    text-decoration: none;
  }
`

const StyledBlockquote = styled.blockquote`
  font-family: 'Source Sans Pro';
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.7px;
  font-size: 23px;
  line-height: 34px;
  color: #1a1c21;
  margin: 0 70px;
`

const StyledUnorderedListItem = styled.li`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.6px;
  line-height: 30px;
  word-break: break-all;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding-left: 20px;
    padding-right: 20px;
  }
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
  return data.map((mediaBlock, index) => {
    const text = _.get(children, `[${index}][1][0]`, '').trim()
    let media

    if (mediaBlock.type === 'image') {
      media = <StyledImage src={getImageUrl(mediaBlock.url, 'contentBlock')} />
    }
    else if (mediaBlock.type === 'video') {
      media = <Video
        {...getBodyVideoUrls(mediaBlock.url)}
        withPrettyControls
              />
    }
    else return null

    return [
      <Spacer key={0} />,
      <div key={keys[index]}>
        {media}
        {text && <Caption>{text}</Caption>}
      </div>,
      <Spacer key={1} />,
      <Spacer key={2} />,
    ]
  })
}

// only actually using unstyled - atomic - header-one
const blocks = {
  unstyled: (children, { keys }) =>
    children.map((child, i) => [
      <BodyText key={keys[i]}>{child}</BodyText>,
      <Spacer key={1} />,
    ]),
  atomic: getAtomic,
  blockquote: (children, { keys }) => [
    <StyledBlockquote key={keys[0]}>{children}</StyledBlockquote>,
    <Spacer key={1} />,
  ],
  'unordered-list-item': (children, { keys }) => [
    <ul key={1}>
      {children.map((child, i) => (
        <StyledUnorderedListItem key={keys[i]}>{child}</StyledUnorderedListItem>
      ))}
    </ul>,
    <Spacer key={2} />,
  ],
  'header-one': (children, { keys }) =>
    children.map((child, i) => [
      <HeaderOne key={keys[i]}>{child}</HeaderOne>,
      <Spacer key={1} />,
    ]),
  'header-two': (children, { keys }) =>
    children.map((child, i) => <h2 key={keys[i]}>{child}</h2>),
  'header-three': (children, { keys }) =>
    children.map((child, i) => <h3 key={keys[i]}>{child}</h3>),
  'header-four': (children, { keys }) =>
    children.map((child, i) => <h4 key={keys[i]}>{child}</h4>),
  'header-five': (children, { keys }) =>
    children.map((child, i) => <h5 key={keys[i]}>{child}</h5>),
  'header-six': (children, { keys }) =>
    children.map((child, i) => <h6 key={keys[i]}>{child}</h6>),
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
    author: PropTypes.object,
  }

  isPrivilegedUser = () => {
    const role = _.get(this.props, 'author.role', '')
    const isChannel = _.get(this.props, 'author.isChannel', false)
    return LINK_ROLES.includes(role) || isChannel
  }

  /* Pasted links are automatically made into Link entities, but we do not
   * allow active links offiste except for certain user types
   */
  getEntities = () => ({
    LINK: (children, entity, { key }) =>
      this.isPrivilegedUser() ? (
        <StyledLink
          key={key}
          href={entity.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </StyledLink>
      ) : (
        <StyledStrong key={key}>{children}</StyledStrong>
      ),
  })

  trimSpacers = contentSections => {
    if (!contentSections) return null
    if (!contentSections.length) return contentSections

    const lastIdx = contentSections.length - 1
    const lastSection = contentSections[lastIdx]
    const lastSectionLastIdx = lastSection.length - 1
    const lastBlock = lastSection[lastSectionLastIdx]

    // remove gap between paragraph text and start of an unordered list
    // FIXME: Currently buggy -- will crash on view when ul is the last block
    // contentSections.forEach((section, idx) => {
    //   if (
    //     idx > 0
    //     && section[0]
    //     && section[0].type === 'ul'
    //     && contentSections[idx - 1]
    //     && _.get(
    //       contentSections[idx - 1],
    //       `[${contentSections[idx - 1].length - 1}][1].props.spacer`,
    //     )
    //   ) {
    //     contentSections[idx - 1][1].pop()
    //   }
    // })

    // sections [array] contain blocks [array], which contain block parts [objects]
    // e.g. [ [[{text}, {spacer}], [{text}, {spacer}]], [[{spacer}, {image}, {spacer}, {spacer}]] ]
    //
    // 1. return all but the last section as normal
    // 2. within the last section, return all but the last block as normal
    // 3. filter that block to remove spacers after content
    return [
      ...contentSections.slice(0, lastIdx),
      [
        ...lastSection.slice(0, lastSectionLastIdx),
        lastBlock.filter((part, idx) => idx === 0 || !_.get(part, 'props.spacer')),
      ],
    ]
  }

  render() {
    const { story } = this.props
    if (!story.draftjsContent) return null

    const entities = this.getEntities()
    const contentBlocks = this.trimSpacers(
      redraft(story.draftjsContent, { inline, blocks, entities }, options),
    )

    return <ContentContainer>{contentBlocks}</ContentContainer>
  }
}
