import { connect } from 'react-redux'
import PostCardSlider from '../../Components/PostCard/PostCardSlider'
import PostcardActions from '../../Shared/Redux/Entities/Postcards'

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
    postcards: state.entities.postcards.postcards,
    fetchStatus: state.entities.postcards.fetchStatus,
    error: state.entities.postcards.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCardSlider)
