import { Component } from 'react'
import PropTypes from 'prop-types'

class StarRating extends Component {
  static propTypes = {
    valueSelected: PropTypes.number,
    onChange: PropTypes.func,
  }

  // ensures a user without a rating selects one when editing
  componentDidMount = () => {
    const { valueSelected, onChange } = this.props
    if (onChange && !valueSelected) onChange(this.state.rating)
  }

  handleStarClick = rating => () => {
    if (!this.props.onChange) return null
    this.props.onChange(rating)
  }
}

export default StarRating
