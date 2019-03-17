import { connect } from 'react-redux'
import PostCardScreen from '../../Components/PostCard/PostCardScreen'
import PostcardActions from '../../Shared/Redux/PostcardRedux'

function mapDispatchToProps(dispatch) {
  return {
    createPostcard: (postcard) => dispatch(PostcardActions.createPostcardRequest(postcard)),
    deletePostcard: (cardId) => dispatch(PostcardActions.deletePostcardRequest(cardId)),
    getPostcard: (cardId) => dispatch(PostcardActions.getPostcardRequest(cardId)),
    getPostcards: () => dispatch(PostcardActions.getPostcardsRequest()),
  }
}

function mapStateToProps(state) {
  return {
    fetchStatus: state.postcards.fetchStatus,
    error: state.postcards.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCardScreen)
