import PropTypes from 'prop-types'
import { Component } from 'react'
import { find } from 'lodash'

import GuideActions from '../Redux/Entities/Guides'

export class SharedComponent extends Component {
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
    filteredGuides: this.props.guides,
  }

  onDone = () => {
    const {bulkSaveStoryToGuide, story} = this.props
    const {isInGuideById} = this.state
    bulkSaveStoryToGuide(story._id, isInGuideById)
    this.exit()
  }

  componentDidMount = () => {
    this.props.getUserGuides(this.props.user.id)
  }

  componentDidUpdate(prevProps) {
    const {guides, story} = this.props
    if (prevProps.guides.length !== this.props.guides.length) {
      this.setState({
        isInGuideById: getIsInGuidesById(guides, story.id),
        filteredGuides: this.getFilteredGuides(this.state.searchTerm || ''),
      })
    }
  }

  getFilteredGuides = (searchTerm) => {
    return this.props.guides.filter((guide) => {
      return guide.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    })
  }

  filterGuides = (searchTerm) => {
    this.setState({
      filteredGuides: this.getFilteredGuides(searchTerm),
      searchTerm: searchTerm,
    })
    return searchTerm
  }

  toggleGuide = guideId => {
    const {isInGuideById} = this.state
    isInGuideById[guideId] = !isInGuideById[guideId]
    this.setState({isInGuideById})
  }
}

function getIsInGuidesById(guides, storyId) {
  const isInGuideById = {}
  for (let guide of guides) {
    isInGuideById[guide.id] = guide.stories.indexOf(storyId) !== -1
  }
  return isInGuideById
}

export const mapStateToProps = (state, ownProps) => {
  const sessionUserId = state.session.userId
  const {guideIdsByUserId, entities, fetchStatus} = state.entities.guides
  const story = state.entities.stories.entities[ownProps.storyId]
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
    isInGuideById: getIsInGuidesById(usersGuides, ownProps.storyId),
    fetching: fetchStatus.fetching,
    loaded: fetchStatus.loaded,
    status: fetchStatus,
    story,
  }
}

export const mapDispatchToProps = dispatch => ({
  getUserGuides: userId => dispatch(GuideActions.getUserGuides(userId)),
  bulkSaveStoryToGuide: (storyId, isInGuideById) => {
    dispatch(GuideActions.bulkSaveStoryToGuideRequest(storyId, isInGuideById))
  },
})
