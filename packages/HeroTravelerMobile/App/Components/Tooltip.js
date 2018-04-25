import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/TooltipStyles'
import RoundedButton from './RoundedButton'
import MobileMetrics from '../Themes/Metrics';

export default class Tooltip extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(["default", "image-edit"]),
    onDismiss: PropTypes.func,
    style: PropTypes.object,
    // Some predefined positions to cover most of the scenarios.
    // Only available for the "default" type.
    position: PropTypes.oneOf(["title", "top-right", "bottom-center"]),
    dimBackground: PropTypes.bool,
    text: PropTypes.string,
  }

  calculateStyles() {
    let container = {};
    let tip = {};
    let textContainer = {};

    switch (this.props.position) {
      case "title":
        container = {
          alignItems: 'center',
          top: MobileMetrics.navBarHeight + 5,
        }
        break;
      case "right-nav-button":
        container = {
          alignItems: 'flex-end',
          paddingRight: 30,
          top: MobileMetrics.navBarHeight + 5,
        };
        tip = {
          right: 43,
        }
        break;
      case "bottom-center":
        container = {
          alignItems: 'center',
          top: null,
          bottom: MobileMetrics.navBarHeight - 5,
        };
        tip = {
          top: null,
          bottom: -5,
          borderTopWidth: 6,
          borderTopColor: 'white',
          borderBottomWidth: null,
          borderBottomColor: null,
          shadowOffset: {width: 0, height: 1}
        };
        break;
    }

    return {container, tip, textContainer}
  }

  renderGenericTooltip() {
    let calculatedStyles = this.calculateStyles();
    let customStyle = Object.assign({container:null, tip:null, textContainer:null, text:null}, this.props.style);

    return (
      <View style={[styles.container, calculatedStyles.container, customStyle.container]}>
        <View style={[styles.textContainer, calculatedStyles.textContainer, customStyle.textContainer]}>
          <Text style={[styles.text, customStyle.text]}>{this.props.text}</Text>
        </View>
        <View style={[styles.tip, calculatedStyles.tip, customStyle.tip]} />
      </View>
    );
  }

  renderImageEdit() {
    return (
      <View style={styles.imageEditContainer}>
        <View style={styles.imageEditIconContainer}>
          <Icon name='camera' style={styles.imageEditIconCamera} size={18} />
          <Icon name='bullseye' style={styles.imageEditIconBullseye} size={18} />
          <Icon name='hand-pointer-o' style={styles.imageEditIconPointer} size={30} />
        </View>
        <Text style={styles.imageEditText}>Tap an image to edit it</Text>
        <RoundedButton
          style={styles.imageEditButton}
          textStyle={styles.imageEditButtonText}
          onPress={this.props.onDismiss}>Ok, I got it</RoundedButton>
      </View>
    );
  }

  renderContent() {
    switch (this.props.type) {
      case "image-edit":
        return this.renderImageEdit();
      default:
        return this.renderGenericTooltip();
    }
  }

  render () {
    return (
      <TouchableOpacity
        style={[styles.backgroundOverlay, this.props.dimBackground ? styles.backgroundOverlayDimmed : null]}
        onPress={this.props.onDismiss}
      >
        {this.renderContent()}
      </TouchableOpacity>
    )

  }
}
