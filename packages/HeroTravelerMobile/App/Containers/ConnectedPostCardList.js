import { connect } from 'react-redux'

import SessionActions from '../Shared/Redux/SessionRedux'
import PostCardList from '../Components/PostCard/PostCardList'

const mapStateToProps = (state) => {
  const dummyData = [
    {
      coverImage: 'https://images.unsplash.com/photo-1551704309-a8876f22745d',
      caption: 'Winter Mountains'
    },
    {
      coverImage: 'https://images.unsplash.com/photo-1551801234-6304319ed9bc',
      caption: 'Wild Ice Hokey'
    },
    {
      coverImage: 'https://images.unsplash.com/photo-1551890312-1ea3beb91e0f',
      caption: 'City Tram'
    },
    {
      coverImage: 'https://images.unsplash.com/photo-1551852121-6ba2913274a1',
      caption: 'Puppy'
    }
  ]

  return {
    entities: dummyData,
    sessionError: state.session.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearSessionError: () => dispatch(SessionActions.clearError()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCardList)
