import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { AbstractStarRating } from '../../Shared/AbstractComponents'
import TabIcon from '../../Components/TabIcon'

import styles from './StarRatingStyles'

class StarRating extends AbstractStarRating {
  render () {
    const StarContainer = this.props.onChange ? TouchableOpacity : View
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map(rating => (
          <StarContainer
            key={rating}
            onPress={this.handleStarClick(rating)}
            style={styles.starContainer}
          >
            <TabIcon
              name={
                rating <= this.props.valueSelected
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
