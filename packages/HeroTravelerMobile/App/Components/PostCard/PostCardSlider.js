import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import Carousel from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Ionicons'
import PostCardSliderItem from './PostCardSliderItem'
import { Metrics } from '../../Shared/Themes'
import FormInput from '../FormInput'

import { Colors } from '../../Shared/Themes'

import Reactotron from 'reactotron-react-native'

import styles from '../Styles/PostCardStyles'

export default class PostCardSlider extends Component {
  static propTypes = {
    postcards: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.state = {
      message: '',
    }
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
  
  handleLayoutChanges = (event) => {
  }

  handleMore = () => {}

  handleAction = () => {}

  handleMute = () => {}

  handleSendMessage = () => {}

  render() {
    const { postcards } = this.props
    const { message } = this.state
    return (
      <View style={styles.container}>
        <Carousel
          style={styles.videoContainer}
          data={postcards}
          layoutCardOffset={0}
          renderItem={this.renderItem}
          onLayout={this.handleLayoutChanges}
          sliderWidth={Metrics.postCard.listing.sliderWidth}
          itemWidth={Metrics.postCard.listing.sliderItemWidth}
          inactiveSlideScale={1}
        />
        <View style={styles.sliderBottom}>
          <View style={styles.sliderBottomAction}>
            <TouchableOpacity onPress={this.handleAction}>
              <Icon name='ios-more'
                size={34}
                color={Colors.snow}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sliderMoreInfo}
              onPress={this.handleMore}>
              <Text style={styles.sliderMoreInfoText}>More Info</Text>
              <Icon name='ios-arrow-up'
                size={20}
                color={Colors.snow}
                onPress={this.handleMore}
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={this.handleMute}>
                <Icon name='ios-volume-off'
                  size={34}
                  color={Colors.snow}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sliderBottomMessage}>
            <FormInput
              onChangeText={this.setMessage}
              value={message}
              placeholder='Send a message'
            />
            <TouchableOpacity onPress={this.handleSendMessage}>
              <Text>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
