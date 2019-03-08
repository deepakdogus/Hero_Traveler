import { connect } from 'react-redux'

import SessionActions from '../Shared/Redux/SessionRedux'
import PostCardList from '../Components/PostCard/PostCardList'

const mapStateToProps = (state) => {
  const dummyData = [
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'Winter Mountains'
    },
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'Wild Ice Hokey'
    },
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'City Tram'
    },
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'Puppy'
    },
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'Earth'
    },
    {
      coverImage: 'test/iafp1skobndeomvpj8om.jpg',
      caption: 'Mars'
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
