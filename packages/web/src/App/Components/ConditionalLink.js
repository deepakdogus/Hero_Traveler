import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div``


export default class ConditionalLink extends React.Component{

  static proptypes = {
    to: PropTypes.string,
    pathname: PropTypes.string,
    onClick: PropTypes.func,
    openSaveEditsModal: PropTypes.func,
  }

  _handleOpenSaveEditsModal = () => {
    this.props.openSaveEditsModal(this.props.to)
  }

  render(){
    const {to, pathname, onClick, openSaveEditsModal} = this.props
    const link = pathname.includes('editStory') ?
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
        {this.props.children}
      </Container>
      : <Link to={to}>
          {this.props.children}
        </Link>

      return(
        <Container>
          {link}
        </Container>
      )
  }

}

