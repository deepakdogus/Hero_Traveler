import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'
import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import { find } from 'lodash'
import SearchBar from '../../Components/SearchBar'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import GuideListItem from '../../Components/GuideListItem'
import storyCoverStyles from '../CreateStory/2_StoryCoverScreenStyles'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import NavBar from '../CreateStory/NavBar'

import { Metrics } from '../../Shared/Themes'

import styles from '../Styles/AddStoryToGuidesStyles'

class AddStoryToGuides extends Component {
  static defaultProps = {
    onCancel: NavActions.pop,
    onDone: NavActions.pop,
  }

  static propTypes = {
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
  }

  state = {
    storyGuides: this.props.storyGuides || [],
    // this is not ideal, guides should be added/removed from story as
    // making the dependency the other way produces maintenance overhead
    addedGuides: [],
    removedGuides: [],
  }

  onDone = () => {
    // const { removedGuides, storyGuides } = this.state
    // for (let removeGuide of removedGuides) {
    //   // Remove story from guide and update guide
    //   // removeGuide = Object.assign({}, removeGuide, {
    //   //   stories: removeGuide.stories.filter((s) => s !== this.props.story._id)
    //   // })
    //   // this.props.updateGuide(removeGuide)
    // }
    // for (let addGuide of storyGuides) {
    //   const wasInProps = this.props.storyGuides.filter((g) => g._id === addGuide._id).length === 1
    //   if (wasInProps) {
    //     // Do nothing with guide
    //   } else {
    //     // Add story to guide
    //   }
    // }
  }

  componentDidMount = () => {
    this.props.getUserGuides(this.props.user.id)
  }

  toggleGuide = guide => {

  }

  filterGuides = (searchTerm) => {
    return searchTerm
  }

  createGuide = () => {
    const {story} = this.props
    NavActions.createGuide({ story })
  }

  render = () => {
    const { storyGuides } = this.state
    const { guides, onCancel, fetching } = this.props

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
            isRightValid={this.props.storyGuides.length !== storyGuides.length}
            onRight={this.onDone}
            rightDisabled={this.props.storyGuides.length === storyGuides.length}
            rightTitle={'Done'}
            rightTextStyle={storyCoverStyles.navBarRightTextStyle}
            style={storyCoverStyles.navBarStyle}
          />
          <View style={styles.list}>
            <SearchBar
              onSearch={this.filterGuides}
            />
            <GuideListItem
              create
              onPress={this.createGuide}
            />
            {fetching && (
              <ActivityIndicator
                animating={fetching}
                style={{ padding: Metrics.baseMargin }}
              />
            )}
            {guides.length &&
              guides.map((guide, idx) => {
                const isActive =
                  storyGuides.filter(g => g._id === guide.id).length === 1
                return (
                  <GuideListItem
                    imageUri={{ uri: getImageUrl(guide.coverImage, 'basic') }}
                    key={`guide--${idx}`}
                    label={guide.title}
                    active={isActive}
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

const mapStateToProps = (state, ownProps) => {
  // Integrate mapping of guides to user here.
  const guides = []
  for (let guideKey of Object.keys(state.entities.guides.entities)) {
    guides.push(state.entities.guides.entities[guideKey])
  }
  // Create story guides array so can see those that are already checked/unchecked
  const storyGuides = []
  for (let guide of guides) {
    if (guide.stories.includes(ownProps.story._id)) {
      storyGuides.push(guide)
    }
  }
  return {
    user: state.entities.users.entities[state.session.userId],
    accessToken: find(state.session.tokens, { type: 'access' }),
    guides,
    storyGuides,
    fetching: state.entities.guides.fetchStatus.fetching,
    loaded: state.entities.guides.fetchStatus.loaded,
    status: state.entities.guides.fetchStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  getUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddStoryToGuides)
