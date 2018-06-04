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
    isInGuide: this.props.isInGuide || [],
  }

  onDone = () => {

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
    const { isInGuide } = this.state
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
              create
              onPress={this.createGuide}
            />
            {fetching && (
              <ActivityIndicator
                animating={fetching}
                style={{ padding: Metrics.baseMargin }}
              />
            )}
            {!!guides.length &&
              guides.map((guide, idx) => {
                const isActive = isInGuide[guide.id]
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
  const sessionUserId = state.session.userId
  const {guideIdsByUserId, entities, fetchStatus} = state.entities.guides
  const storyId = ownProps.story._id
  let usersGuides = []
  let isInGuide = {}
  // if the user has guides we populate usersGuides and isInGuide
  if (guideIdsByUserId[sessionUserId]) {
    usersGuides = guideIdsByUserId[sessionUserId].map(key => {
      return entities[key]
    })
    // Create story guides array so can see those that are already checked/unchecked
    isInGuide = {}
    for (let guide of usersGuides) {
      isInGuide[guide.id] = guide.stories.indexOf(storyId) !== -1
    }
  }

  return {
    user: state.entities.users.entities[sessionUserId],
    accessToken: find(state.session.tokens, { type: 'access' }),
    guides: usersGuides,
    isInGuide,
    fetching: fetchStatus.fetching,
    loaded: fetchStatus.loaded,
    status: fetchStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  getUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddStoryToGuides)
