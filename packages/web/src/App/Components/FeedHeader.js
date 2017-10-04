import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './Header'
import HeaderImageWrapper from './HeaderImageWrapper'
import FeedCarousel from './FeedCarousel'
import HeaderTopGradient from './Headers/Shared/HeaderTopGradient'
import CarouselSlide from './CarouselSlide'

const StyledHeaderImageWrapper = styled(HeaderImageWrapper)`
  max-height: 570px;
`

export default class FeedHeader extends React.Component {
  static propTypes = {
    stories: PropTypes.object,
    author: PropTypes.object,

  }

  renderSlides(stories, author) {
    const storyKeys = Object.keys(stories);

    return storyKeys.map((key, index) => {
      const story = stories[key]
      const author = this.props.users[story.author]

      return (
        <CarouselSlide
          key={key}
          story={story}
          author={author}
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
        <Header isLoggedIn></Header>
        <FeedCarousel>
          {this.renderSlides(this.props.stories)}
        </FeedCarousel>
      </StyledHeaderImageWrapper>
    )
  }
}
