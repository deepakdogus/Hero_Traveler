import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Carousel from 'nuka-carousel'

import RoundedButton from '../Shared/Web/Components/RoundedButton'
import Icon from '../Shared/Web/Components/Icon'

import './Styles/CarouselStyles.css'

const StyledRoundedButton = styled(RoundedButton)`
	border: 0px;
	background-color: rgba(26,28,33,0.1);
	outline: none;
`

const StyledArrowIcon = styled(Icon)`
	width: 12px;
	height: 20px;
  align-self: center;
  cursor: pointer;
  margin-left: ${props => props.name === 'arrowLeft' ? '0' : '4px'};
  margin-right: ${props => props.name === 'arrowLeft' ? '4px' : '0'};
`

const responsiveArrowButtonStyles = `
  margin: 10px;
`

class Arrow extends React.Component {
  static propTypes = {
    previousSlide: PropTypes.func,
    nextSlide: PropTypes.func,
    name: PropTypes.string,
  }

  render() {
    const {name, previousSlide, nextSlide} = this.props
    const onClickFunction = name === 'arrowLeft' ? previousSlide : nextSlide
    return (
      <StyledRoundedButton
        width='48px'
        height='48px'
        type='headerButton'
        onClick={onClickFunction}
        responsiveButtonProps={responsiveArrowButtonStyles}
      >
        <StyledArrowIcon
          name={name}
          size='medium'
        />
      </StyledRoundedButton>
    )
  }
}

const ArrowRight = (props) => {
  return (
    <Arrow {...props} name='arrowRight'/>
  )
}

const ArrowLeft = (props) => {
  return (
    <Arrow {...props} name='arrowLeft'/>
  )
}

export default class FeedCarousel extends React.Component {
  static propTypes = {
    previousSlide: PropTypes.func,
    nextSlide: PropTypes.func,
  }

  Decorators = [{
    component: ArrowLeft,
    position: 'CenterLeft',
    style: {outline: 'none'},
  },
  {
    component: ArrowRight,
    position: 'CenterRight',
    style: {outline: 'none'},
  }]

  render () {
    return (
      <Carousel
        decorators={this.Decorators}
      >
        {this.props.children}
      </Carousel>
    )
  }
}
