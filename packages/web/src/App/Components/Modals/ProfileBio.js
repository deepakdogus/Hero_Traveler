import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { RightTitle, RightModalCloseX, Text } from './Shared'
import { Row } from '../FlexboxGrid'
import Icon from '../Icon'

const Container = styled.div`
  width: 570px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100vw;
  }
`

const BioContainer = styled.div`
  padding: 50px 65px;
`

const BioText = styled(Text)`
  font-size: 18px;
  text-align: left;
`

const SocialFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SocialFooterText = styled(Text)`
  font-size: 15px;
  padding: 0px;
  margin-top: -10px;
`

const StyledIcon = styled(Icon)`
  height: 25px;
  margin: 10px;
`

const FacebookIcon = styled(StyledIcon)`
  width: 12.5px;
  padding: 0 9px;
  cursor: pointer;
`

const TwitterIcon = styled(StyledIcon)`
  width: 30.5px;
  cursor: pointer;
`

const InstagramIcon = styled(StyledIcon)`
  width: 25px;
  padding: 0 2.5px;
  cursor: pointer;
`

export default class ProfileBio extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    closeModal: PropTypes.func,
  }

  render() {
    const {profile} = this.props

    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>{profile.username.toUpperCase()}</RightTitle>
        <BioContainer>
          <BioText>{profile.bio}</BioText>
        </BioContainer>
        {/* Hidden until after launch
          <SocialFooterContainer>
            <SocialFooterText>Follow me on:</SocialFooterText>
            <Row between='xs'>
              <FacebookIcon name='facebook-blue'/>
              <TwitterIcon name='twitter-blue'/>
              <InstagramIcon name='instagram'/>
            </Row>
          </SocialFooterContainer>
        */}
      </Container>
    )
  }
}
