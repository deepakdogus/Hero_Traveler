import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

const ClickContainer = styled.div`
  cursor: ${props => props.readOnly ? 'auto' : 'pointer'};
`

const Star = styled.div`
  position: relative;

  display: inline-block;
  width: 0;
  height: 0;

  margin-left: 0.9em;
  margin-right: 0.9em;
  margin-bottom: 1.2em;

  border-right: 0.3em solid transparent;
  border-bottom: 0.7em solid
    ${props =>
      props.selected ? props.theme.Colors.redHighlights : props.theme.Colors.feedDividerGrey};
  border-left: 0.3em solid transparent;

  /* Controls the size of the stars. */
  font-size: 13px;

  &:before,
  &:after {
    content: '';

    display: block;
    width: 0;
    height: 0;

    position: absolute;
    top: 0.6em;
    left: -1em;

    border-right: 1em solid transparent;
    border-bottom: 0.7em solid
      ${props =>
        props.selected ? props.theme.Colors.redHighlights : props.theme.Colors.feedDividerGrey};
    border-left: 1em solid transparent;

    transform: rotate(-35deg);
  }

  &:after {
    transform: rotate(35deg);
  }
`

class StarRating extends Component {
  static propTypes = {
    valueSelected: PropTypes.number,
    onClick: PropTypes.func,
    readOnly: PropTypes.bool,
  }

  state = {
    rating: this.props.valueSelected || 5,
  }

  // ensures a user without a rating selects one when editing
  componentDidMount = () => {
    const { readOnly, valueSelected, onClick } = this.props
    if (!readOnly && !valueSelected) onClick(this.state.rating)
  }

  handleStartClick = rating => () => {
    if (this.props.readOnly) return null
    this.setState({ rating })
    this.props.onClick(rating)
  }

  render = () => (
    <Container>
      {[1, 2, 3, 4, 5].map(rating => (
        <ClickContainer
          key={rating}
          onClick={this.handleStartClick(rating)}
          readOnly={this.props.readOnly}
        >
          <Star selected={rating <= this.state.rating} />
        </ClickContainer>
      ))}
    </Container>
  )
}

export default StarRating
