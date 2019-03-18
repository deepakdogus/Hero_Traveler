import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import HeaderImageWrapper from './HeaderImageWrapper'
import FeedCarousel from './FeedCarousel'
import HeaderTopGradient from '../Shared/Web/Components/Headers/Shared/HeaderTopGradient'
import HeaderSlide from './HeaderSlide'

const StyledHeaderImageWrapper = styled(HeaderImageWrapper)`
  max-height: 570px;
`

export default class FeedHeader extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.object,
  }

  renderSlides(stories) {
    // limit number of slides to show to only show 5 slides on the Hero
    const storyKeys = Object.keys(stories).slice(0, 5)

    return storyKeys.map((key) => {
      const story = stories[key]
      const author = this.props.users[story.author]

      return (
        <HeaderSlide
          key={key}
          story={story}
          author={author}
          isPreview
        />
      )
    })
  }

  render () {
    return (
      <StyledHeaderImageWrapper
        size='fullScreen'
        type='story'
      >
        <HeaderTopGradient/>
        <FeedCarousel>
          {this.renderSlides(this.props.stories)}
        </FeedCarousel>
      </StyledHeaderImageWrapper>
    )
  }
}
