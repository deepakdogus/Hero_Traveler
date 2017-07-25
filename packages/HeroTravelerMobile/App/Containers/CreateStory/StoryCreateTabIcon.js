import React from 'react'
import { TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import TabIcon from '../../Components/TabIcon'
import StoryEditActions from '../../Redux/StoryCreateRedux'

class StoryCreateTabIcon extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.toggleCreateView}
      >
        <TabIcon {...this.props} />
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCreateView: () =>
      dispatch(StoryEditActions.toggleCreateModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryCreateTabIcon)

