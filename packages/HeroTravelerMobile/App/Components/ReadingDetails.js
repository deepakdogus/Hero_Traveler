import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
} from 'react-native'
import moment from 'moment'

import TabIcon from './TabIcon'
import {styles} from '../Containers/Styles/StoryReadingScreenStyles'
import {displayLocationDetails} from '../Shared/Lib/locationHelpers'
import {showTravelDate, getTripDate} from '../Shared/Lib/dateHelpers'

// this is to render all the details rows that have icons associated to them
class ReadingDetails extends React.Component {
  static propTypes = {
    targetEntity: PropTypes.object,
  }

  hasLocationInfo() {
    const {locationInfo, locations} = this.props.targetEntity
    return (
      (!!locationInfo && !!locationInfo.name)
      || (locations && locations.length && locations[0].name)
    )
  }

  getLocationText() {
    const {locationInfo, locations} = this.props.targetEntity
    if (locationInfo) return displayLocationDetails(locationInfo)
    else {
      return locations.map(displayLocationDetails).join(`\n`)
    }
  }

  getCategoriesText = () => {
    return this.props.targetEntity.categories.map((category) => {
      return category.title
    }).join(', ')
  }

  getDurationText = () => {
    const {duration} = this.props.targetEntity
    if (duration === 1) return `${duration} day`
    return `${duration} days`
  }

  getCostType = () => {
    const {type, currency} = this.props.targetEntity
    let title = '';
    switch (type) {
      case 'see':
      case 'do':
        break;
      case 'eat':
        title = ' per person'
        break;
      case 'stay':
        title = ' per night'
        break;
      default:
        break;
    }
    // The currency is hardcoded for now, might want to change it later.
    let currencySign = currency || ' USD';
    title = currencySign + title;
    return title;
  }

  renderRow(iconName, label, text, isRedText, iconStyle = { image: styles.icon }){
    return (
      <View style={styles.sectionWrapper}>
        <View style={styles.iconWrapper}>
          <TabIcon
            name={iconName}
            style={iconStyle}
          />
        </View>
        <View style={styles.sectionTextWrapper}>
          <Text style={styles.sectionLabel}>{label}: </Text>
          <Text style={[
            styles.sectionText,
            isRedText ? styles.sectionTextHighlight : {}
          ]}>
            {text}
          </Text>
        </View>
      </View>
    )
  }

  render () {
    const { targetEntity } = this.props
    const {categories, cost, travelTips, duration, tripDate} = targetEntity

    return (
      <Fragment>
        {!!this.hasLocationInfo() &&
          this.renderRow(
            'location',
            'Location',
            this.getLocationText(),
            true
          )
        }
        {!!categories.length &&
          this.renderRow(
            'tag',
            'Categories',
            this.getCategoriesText(),
            true
          )
        }
        {!!duration &&
          this.renderRow(
            'date',
            'Duration',
            this.getDurationText()
          )
        }
        {!!cost &&
          this.renderRow(
            'cost',
            'Cost',
            cost + this.getCostType(),
          )
        }
        {showTravelDate(targetEntity) &&
          this.renderRow(
            'date',
            'Travel Date',
            getTripDate(targetEntity),
          )
        }
        {!!travelTips &&
          this.renderRow(
            'travelTips',
            'Travel Tips',
            travelTips,
          )
        }
      </Fragment>
    )
  }
}

export default ReadingDetails
