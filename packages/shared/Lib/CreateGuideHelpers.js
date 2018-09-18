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
      stories: [this.props.story],
    },
  }
}

export const mapStateToProps = (state, props) => {
  const {
    fetchStatus,
    error,
    entities: guides,
  } =  state.entities.guides

  return {
    user: state.entities.users.entities[state.session.userId],
    guide: guides[props.guideId],
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
