import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import {
  Container,
  ExteriorCloseXContainer,
} from './Shared'
import Icon from '../../Shared/Web/Components/Icon'
import UXActions from '../../Redux/UXRedux'

class OnClickOutsideModal extends Component {
  static propTypes = {
    closeGlobalModal: PropTypes.func,
    children: PropTypes.array,
  }

  handleClickOutside = (e) => {
    e.preventDefault()
    this.props.closeGlobalModal()
  }

  renderExteriorX = () => (
    <ExteriorCloseXContainer>
      <Icon
        name='closeWhite'
        onClick={this.handleClickOutside}
      />
    </ExteriorCloseXContainer>
  )

  render = () => (
    <Container>
      {this.renderExteriorX()}
      {this.props.children}
    </Container>
  )
}

export const mapDispatchToProps = (dispatch) => ({
  closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
})

export default connect(
  null,
  mapDispatchToProps,
)(onClickOutside(OnClickOutsideModal))
