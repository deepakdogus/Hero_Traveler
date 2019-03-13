import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import TabIcon from '../../Components/TabIcon'

import styles from './StarRatingStyles'

class StarRating extends Component {
  static propTypes = {
    valueSelected: PropTypes.number,
    onChangeRating: PropTypes.func,
    readOnly: PropTypes.bool,
  }

  state = {
    rating: this.props.valueSelected || 5,
  }

  // ensures a user without a rating selects one when editing
  componentDidMount = () => {
    const { readOnly, valueSelected, onChangeRating } = this.props
    if (!readOnly && !valueSelected) onChangeRating(this.state.rating)
  }

  handleStartClick = rating => () => {
    if (this.props.readOnly) return null
    this.setState({ rating })
    this.props.onChangeRating(rating)
  }

  render = () => {
    const StarContainer = this.props.readOnly ? View : TouchableOpacity
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map(rating => (
          <StarContainer
            key={rating}
            onPress={this.handleStartClick(rating)}
            readOnly={this.props.readOnly}
            style={styles.starContainer}
          >
            <TabIcon
              name={
                rating <= this.state.rating
                  ? 'ratingStarActive'
                  : 'ratingStarInactive'
              }
              style={{ image: styles.image }}
            />
          </StarContainer>
        ))}
      </View>
    )
  }
}

export default StarRating
