import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import HorizontalDivider from '../HorizontalDivider'
import SocialMediaRow from '../Signup/SocialMediaRow'

const Container = styled.div`
  padding: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0px;
  }
`
 const StyledSocialMediaRow = styled(SocialMediaRow)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 25px;
  }
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
        <StyledSocialMediaRow
          text={'Facebook'}
          margin='modal'
          isConnected={user.isFacebookConnected}
        />
      </Container>
    )
  }
}
