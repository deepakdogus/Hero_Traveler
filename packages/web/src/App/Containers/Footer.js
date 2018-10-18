import { connect } from 'react-redux'
import Footer from '../Components/Footer'
import UXActions from '../Redux/UXRedux'

const mapDispatchToProps = (dispatch) => {
  return {
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Footer)
