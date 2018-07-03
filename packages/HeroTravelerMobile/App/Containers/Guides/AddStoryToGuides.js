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

function getIsInGuidesById(guides, storyId) {
  return guides.reduce((isInGuideById, guide) => {
    isInGuideById[guide.id] = guide.stories.indexOf(storyId) !== -1
    return isInGuideById
  }, {})
}

class AddStoryToGuides extends Component {
  static defaultProps = {
    onCancel: NavActions.pop,
    onDone: NavActions.pop,
  }

  static propTypes = {
    storyId: PropTypes.string,
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
    bulkSaveStoryToGuide: PropTypes.func,
    getUserGuides: PropTypes.func,
    story: PropTypes.object,
    user: PropTypes.object,
    guides: PropTypes.arrayOf(PropTypes.object),
    isInGuideById: PropTypes.object,
    fetching: PropTypes.bool,
  }

  state = {
    isInGuideById: this.props.isInGuideById || {},
  }

  onDone = () => {
    const {bulkSaveStoryToGuide, story} = this.props
    const {isInGuideById} = this.state
    bulkSaveStoryToGuide(story._id, isInGuideById)
    NavActions.pop()
  }

  componentDidMount = () => {
    this.props.getUserGuides(this.props.user.id)
  }

  componentDidUpdate(prevProps) {
    const {guides, story} = this.props
    if (prevProps.guides.length !== this.props.guides.length) {
      this.setState({
        isInGuideById: getIsInGuidesById(guides, story.id),
      })
    }
  }

  toggleGuide = guideId => {
    const {isInGuideById} = this.state
    isInGuideById[guideId] = !isInGuideById[guideId]
    this.setState({isInGuideById})
  }

  filterGuides = (searchTerm) => {
    return searchTerm
  }

  createGuide = () => {
    const {story} = this.props
    NavActions.createGuide({ story })
  }

  render = () => {
    const { isInGuideById } = this.state
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

const mapStateToProps = (state, ownProps) => {
  const sessionUserId = state.session.userId
  const {guideIdsByUserId, entities, fetchStatus} = state.entities.guides
  const storyId = ownProps.story._id
  let usersGuides = []
  if (guideIdsByUserId && guideIdsByUserId[sessionUserId]) {
    usersGuides = guideIdsByUserId[sessionUserId].map(key => {
      return entities[key]
    })
  }

  return {
    user: state.entities.users.entities[sessionUserId],
    accessToken: find(state.session.tokens, { type: 'access' }),
    guides: usersGuides,
    isInGuideById: getIsInGuidesById(usersGuides, storyId),
    fetching: fetchStatus.fetching,
    loaded: fetchStatus.loaded,
    status: fetchStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  getUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
  bulkSaveStoryToGuide: (storyId, isInGuideById) => {
    dispatch(GuideActions.bulkSaveStoryToGuideRequest(storyId, isInGuideById))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddStoryToGuides)
