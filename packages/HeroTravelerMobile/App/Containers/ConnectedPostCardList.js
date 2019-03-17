import { connect } from 'react-redux'

import SessionActions from '../Shared/Redux/SessionRedux'
import PostCardList from '../Components/PostCard/PostCardList'
import PostcardActions from '../Shared/Redux/PostcardRedux'

const mapStateToProps = (state) => {
  return {
    postcards: state.postcards.postcards,
    sessionError: state.session.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPostcards: () => dispatch(PostcardActions.getPostcardsRequest()),
    clearSessionError: () => dispatch(SessionActions.clearError()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCardList)
