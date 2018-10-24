import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import HorizontalDivider from '../HorizontalDivider'
import SocialMediaRow from '../Signup/SocialMediaRow'

const Container = styled.div`
  padding: 25px;
`

export default class EditConnections extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    const {user} = this.props

    return (
      <Container>
        <HorizontalDivider color='grey'/>
        <SocialMediaRow
          text={'Facebook'}
          margin='modal'
          isConnected={user.isFacebookConnected}
        />
      </Container>
    )
  }
}
