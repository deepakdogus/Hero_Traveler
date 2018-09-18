import { Actions as NavActions } from 'react-native-router-flux'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'

import SearchBar from '../../Components/SearchBar'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {
  SharedComponent,
  mapStateToProps,
  mapDispatchToProps,
} from '../../Shared/Lib/addStoryToGuidesHelpers'
import GuideListItem from '../../Components/GuideListItem'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import NavBar from '../CreateStory/NavBar'

import { Metrics } from '../../Shared/Themes'

import styles from '../Styles/AddStoryToGuidesStyles'

class AddStoryToGuides extends SharedComponent {
    static defaultProps = {
    onCancel: NavActions.pop,
    onDone: NavActions.pop,
  }

  createGuide = () => {
    const {story} = this.props
    NavActions.createGuide({ story })
  }

  exit() {
    NavActions.pop()
  }

  render() {
    const { isInGuideById, filteredGuides } = this.state
    const { onCancel, fetching } = this.props

    return (
      <View style={storyCoverStyles.root}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          stickyHeaderIndices={[0]}>
          <NavBar
            onLeft={onCancel}
            leftTitle={'Cancel'}
            title={'ADD TO GUIDE'}
            onRight={this.onDone}
            rightTitle={'Done'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.list}>
            <SearchBar
              onSearch={this.filterGuides}
            />
            <GuideListItem
              isCreate
              onPress={this.createGuide}
            />
            {fetching && (
              <ActivityIndicator
                animating={fetching}
                style={{ padding: Metrics.baseMargin }}
              />
            )}
            {!!filteredGuides.length &&
              filteredGuides.map((guide, idx) => {
                const isActive = isInGuideById[guide.id]
                return (
                  <GuideListItem
                    imageUri={{ uri: getImageUrl(guide.coverImage, 'basic') }}
                    key={`guide--${idx}`}
                    label={guide.title}
                    active={isActive}
                    guideId={guide.id}
                    onToggle={this.toggleGuide}
                  />
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStoryToGuides)
