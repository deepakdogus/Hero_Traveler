import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView } from 'react-native'
import {Actions as NavActions} from 'react-native-router-flux'
import {navToProfile} from '../Navigation/NavigationRouter'
import styles from '../Containers/Styles/SearchResultsScreenStyles'

import FeedItemsOfType from './GuideStoriesOfType'

class SearchResultsSeeAllScreen extends Component {
  static propTypes = {
    feedItemType: PropTypes.string,
    typeLabels: PropTypes.object,
    feedItems: PropTypes.array,
    userId: PropTypes.string,
  }

  _onPressAuthor = (authorId) => {
    const { userId } = this.props
    if (authorId === userId) navToProfile()
    else NavActions.readOnlyProfile({userId: authorId})
  }

  render = () => {
    const { feedItemType, typeLabels, feedItems } = this.props
    return (
      <View style={styles.root}>
        <ScrollView style={styles.scrollView}>
          <FeedItemsOfType
            type={feedItemType}
            label={typeLabels[feedItemType].toUpperCase()}
            onPressAuthor={this._onPressAuthor}
            isShowAll={true}
            stories={feedItems}
            authors={{}}
            isGuide={feedItemType === 'guides'}
          />
        </ScrollView>
      </View>
    )
  }
}

export default SearchResultsSeeAllScreen
