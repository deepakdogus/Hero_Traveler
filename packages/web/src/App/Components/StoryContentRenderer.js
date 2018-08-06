import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import redraft from 'redraft'
import _ from 'lodash'

import Image from './Image'
import Video from './Video'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {getVideoUrlBase} from '../Shared/Lib/getVideoUrl'

const ContentContainer = styled.div`
  margin: 100px 0;
`

const StyledImage = styled(Image)`
  width: 100%;
`

const Caption = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
`

const Text = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
`

const HeaderOne = styled.h1`
  font-weight: 400;
  font-size: 30px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

const StyledStrong = styled.strong`
  font-weight: 600;
  color: ${props => props.theme.Colors.background};
`

const inline = {
  BOLD: (children, { key }) => <StyledStrong key={key}>{children}</StyledStrong>,
  ITALIC: (children, { key }) => <em key={key}>{children}</em>,
  UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
};

const getAtomic = (children, { data, keys }) => {
  /*
    this seems a pretty precarious to get the text.
    TODO: See if we can find a better way to isolate the text
  */
  const text = _.get(children, '[0][1][0]', '').trim()
  const type = data[0].type
  const mediaUrl =
    type === 'image'
    ? getImageUrl(data[0].url, 'contentBlock')
    : `${getVideoUrlBase()}/${data[0].url}`

  switch (data[0].type) {
    case 'image':
      return (
        <div key={keys[0]}>
          <StyledImage src={mediaUrl} />
          {text && <Caption>{text}</Caption>}
        </div>
      )
    case 'video':
      return (
        <div key={keys[0]}>
          <Video
            src={mediaUrl}
            withPrettyControls
          />
          {text && <Caption>{text}</Caption>}
        </div>
      )
    default:
      return null
  }
}

// only actually using unstyled - atomic - header-one
const blocks = {
  unstyled: (children, { keys }) => <Text key={keys[0]}>{children}</Text>,
  atomic: getAtomic,
  blockquote: (children, { keys }) => <blockquote key={keys[0]} >{children}</blockquote>,
  'header-one': (children, { keys }) => children.map((child, i) => <HeaderOne key={keys[i]}>{child}</HeaderOne>),
  'header-two': (children, { keys }) => children.map((child, i) => <h2 key={keys[i]}>{child}</h2>),
  'header-three': (children, { keys }) => children.map((child, i) => <h3 key={keys[i]}>{child}</h3>),
  'header-four': (children, { keys }) => children.map((child, i) => <h4 key={keys[i]}>{child}</h4>),
  'header-five': (children, { keys }) => children.map((child, i) => <h5 key={keys[i]}>{child}</h5>),
  'header-six': (children, { keys }) => children.map((child, i) => <h6 key={keys[i]}>{child}</h6>),
};

const entities = {
  LINK: (children, entity, { key }) => <a key={key} href={entity.url}>{children}</a>,
};

const options = {
  cleanup: {
    after: 'all',
    types: 'all',
    split: true,
  },
};

export default class StoryContentRenderer extends React.Component {
  static propTypes = {
    story: PropTypes.object,
  }

  render () {
    const {story} = this.props
    if (!story.draftjsContent) return null
    return (
      <ContentContainer>
        {redraft(story.draftjsContent, { inline, blocks, entities }, options)}
      </ContentContainer>
    )
  }
}
