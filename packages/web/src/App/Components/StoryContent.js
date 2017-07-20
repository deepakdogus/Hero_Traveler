import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import redraft from 'redraft'

import Image from './Image'

const ContentContainer = styled.div`
  margin: 100px 0;
`

const StyledImage = styled(Image)`
  width: 100%;
`

const VideoWrapper = styled.figure`
  text-align: center;
  background-color: ${props => props.theme.Colors.background};
  margin: 0;
  max-height: 700px;
`

const StyledVideo = styled.video`
  max-height: 700px;
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

const inline = {
  BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
  ITALIC: (children, { key }) => <em key={key}>{children}</em>,
  UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
};

const getAtomic = (children, { data, keys }) => {
  /*
    this seems a pretty precarious to get the text.
    TODO: See if we can find a better way to isolate the text
  */
  const text = children[0][1][0]
  switch (data[0].type) {
    case 'image':
      return (
        <div key={keys[0]}>
          <StyledImage src={data[0].url} />
          {text && <Caption>{text}</Caption>}
        </div>
      )
    case 'video':
      return (
        <div key={keys[0]}>
          <VideoWrapper>
            <StyledVideo src={data[0].url} controls/>
          </VideoWrapper>
          {text && <Caption>{text}</Caption>}
        </div>
      )
    default:
      return null
  }
}

/**
 * Note that children can be maped to render a list or do other cool stuff
 */
const blocks = {
  unstyled: (children, { keys }) => <Text key={keys[0]}>{children}</Text>,
  atomic: getAtomic,
  blockquote:
    (children, { keys }) => <blockquote key={keys[0]} >{children}</blockquote>,
  'header-one': (children, { keys }) => children.map((child, i) => <h1 key={keys[i]}>{child}</h1>),
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

export default class StoryContent extends React.Component {
  static propTypes = {
    story: PropTypes.object,
  }
  render () {
    const {story} = this.props
    return (
      <ContentContainer>
        {redraft(story.draftjsContent, { inline, blocks, entities }, options)}
      </ContentContainer>
    )
  }
}
