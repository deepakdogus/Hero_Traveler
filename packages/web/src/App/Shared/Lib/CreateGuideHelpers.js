import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'

import GuideActions from '../Redux/Entities/Guides'
import UserActions from '../Redux/Entities/Users'

export class SharedCreateGuide extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    guide: PropTypes.object,
    fetching: PropTypes.bool,
    user: PropTypes.object,
    story: PropTypes.object,
    updateGuide: PropTypes.func,
    createGuide: PropTypes.func,
    error: PropTypes.object,
    dismissError: PropTypes.func,
    guideFailure: PropTypes.func,
    completeTooltip: PropTypes.func,
  }

  state = {
    creating: false,
    guide: {
      id: undefined,
      title: undefined,
      description: undefined,
      author: _.get(this, 'props.user.id'),
      categories: [],
      locations: [],
      flagged: undefined,
      counts: undefined,
      coverImage: undefined,
      isPrivate: undefined,
      cost: undefined,
      duration: undefined,
      stories: [],
    },
  }

  isExistingGuide = () => {
    const {guide} = this.state
    return guide && guide.id
  }

  isGuideValid = () => {
    const {coverImage, title, locations} = this.state.guide
    return !!coverImage && !!title && locations.length
  }

  onDone = () => {
    const {creating} = this.state
    const {
      updateGuide,
      createGuide,
      user,
      guideFailure,
      story,
      storyId,
    } = this.props
    if (creating) return
    if (!this.isGuideValid()) {
      guideFailure(new Error(
        "Please ensure the guide has a photo, a title, and at least one location."
      ))
      return
    }

    let onDoneFunc
    let guide = this.state.guide
    if (this.isExistingGuide()) onDoneFunc = updateGuide
    else {
      onDoneFunc = createGuide
      guide.stories.push(_.get(story, 'id') || storyId)
    }
    this.setState(
      {
        creating: true,
      },
      () => {
        onDoneFunc(guide, user.id)
      }
    )
  }

  componentDidUpdate = (prevProps) => {
    if (
      this.state.creating &&
      prevProps.fetching && this.props.fetching === false
    ) {
      if (!prevProps.error && this.props.error) {
        this.setState({creating: false})
      }
      else {
        this.setState(
          {creating: false},
          this.onSuccessfullSave,
        )
      }
    }
    else if (!prevProps.guide && this.props.guide) {
      this.setState({
        guide: this.props.guide,
      })
    }
  }
}

export const mapStateToProps = (state, ownProps) => {
  const {
    fetchStatus,
    error,
    entities: guides,
  } =  state.entities.guides

  return {
    user: state.entities.users.entities[state.session.userId],
    guide: guides[ownProps.guideId],
    fetching: fetchStatus.fetching,
    error: error,
    loaded: fetchStatus.loaded,
    status: fetchStatus,
  }
}
export const mapDispatchToProps = dispatch => ({
  createGuide: (guide, userId) => dispatch(GuideActions.createGuide(guide, userId)),
  updateGuide: guide => dispatch(GuideActions.updateGuide(guide)),
  guideFailure: error => dispatch(GuideActions.guideFailure(error)),
  dismissError: () => dispatch(GuideActions.dismissError()),
  completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips})),
})
