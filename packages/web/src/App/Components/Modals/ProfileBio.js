import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, RightModalCloseX, Text} from './Shared'
import {Row} from '../FlexboxGrid'
import Icon from '../Icon'

const Container = styled.div``

const BioContainer = styled.div`
  padding: 50px 65px;
`

const BioText = styled(Text)`
  font-size: 18px;
  text-align: left;
`

const SocialFooterContainer = styled.div`
  padding: 0px 210px;
  text-align: center;
`

const SocialFooterText = styled(Text)`
  font-size: 15px;
  padding: 0px;
  margin-top: -10px;
`

const StyledIcon = styled(Icon)`
  width: 25px;
  height: 25px;
  margin-top: 10px;
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
        <SocialFooterContainer>
          <SocialFooterText>Follow me on:</SocialFooterText>
          <Row between='xs'>
            <StyledIcon name='facebook-dark'/>
            <StyledIcon name='twitter-dark'/>
            <StyledIcon name='instagram-dark'/>
          </Row>
        </SocialFooterContainer>
      </Container>
    )
  }
}
