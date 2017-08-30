import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Carousel from 'nuka-carousel'

import RoundedButton from './RoundedButton'
import Icon from './Icon'


const StyledRoundedButton = styled(RoundedButton)`
	border: 0px;
	background-color: rgba(26,28,33,0.1);
	outline: none;
`

const StyledArrowIconLeft = styled(Icon)`
	width: 12px;
	height: 20px;
	align-self: center;
	margin-right: 4px;
`

const StyledArrowIconRight = styled(Icon)`
	width: 12px;
	height: 20px;
	align-self: center;
	margin-left: 4px;
`

class ArrowLeft extends React.Component {
  static propTypes = {
    previousSlide: PropTypes.func,
  }  			
  		render() {
  			return (
  				<StyledRoundedButton
  					width='48px'
  					height='48px'
  					type='headerButton'
  					onClick={this.props.previousSlide}
  				>
  					<StyledArrowIconLeft
  						name='arrowLeft'
  						size='medium'
  					/>
  				</StyledRoundedButton>
  			)
  		}
}


class ArrowRight extends React.Component {
  static propTypes = {
    nextSlide: PropTypes.func,
  }  		
  		render() {
  			return (
  				<StyledRoundedButton
  					width='48px'
  					height='48px'
  					type='headerButton'
  					onClick={this.props.nextSlide}
  				>
  					<StyledArrowIconRight
  						name='arrowRight'
  						size='medium'
  					/>
  				</StyledRoundedButton>
  			)
  		}
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
  },];


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
