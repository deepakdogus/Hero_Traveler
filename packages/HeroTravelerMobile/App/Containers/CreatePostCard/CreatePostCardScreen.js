import { connect } from 'react-redux'
import PostCardScreen from '../../Components/PostCard/PostCardScreen'
import PostcardActions from '../../Shared/Redux/PostcardRedux'

function mapDispatchToProps(dispatch) {
  return {
    createPostcard: (postcard) => dispatch(PostcardActions.createPostcard(postcard)),
    deletePostcard: (cardId) => dispatch(PostcardActions.deletePostcard(cardId)),
    getPostcard: (cardId) => dispatch(PostcardActions.getPostcard(cardId)),
    getPostcards: () => dispatch(PostcardActions.getPostcards()),
  }
}

export default connect(null, mapDispatchToProps)(PostCardScreen)
