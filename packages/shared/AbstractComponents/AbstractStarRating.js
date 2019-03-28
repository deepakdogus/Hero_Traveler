import { Component } from 'react'
import PropTypes from 'prop-types'

class AbstractStarRating extends Component {
  static propTypes = {
    valueSelected: PropTypes.number,
    onChange: PropTypes.func,
  }

  handleStarClick = rating => () => {
    if (!this.props.onChange) return null
    this.props.onChange(rating)
  }
}

export default AbstractStarRating
