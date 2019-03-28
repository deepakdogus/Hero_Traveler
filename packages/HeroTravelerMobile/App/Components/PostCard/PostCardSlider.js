import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Carousel from 'react-native-snap-carousel'
import PostCardSliderItem from './PostCardSliderItem'
import { Metrics } from '../../Shared/Themes'

import styles from '../Styles/PostCardStyles'

export default class PostCardSlider extends Component {
  static propTypes = {
    postcards: PropTypes.array,
  }

  componentDidMount() {
    const { postcards } = this.props

    if (postcards.length === 0) {
      NavActions.pop()
    }
  }

  keyExtractor = item => item._id

  renderItem = ({item}) => {
    return (
      <PostCardSliderItem postcard={item} />
    )
  }

  render() {
    const { postcards } = this.props

    return (
      <View style={styles.container}>
        <Carousel
          data={[postcards]}
          renderItem={this.renderItem}
          sliderWidth={Metrics.postCard.listing.sliderWidth}
          itemWidth={Metrics.postCard.listing.sliderItemWidth}
        />
      </View>
    )
  }
}
