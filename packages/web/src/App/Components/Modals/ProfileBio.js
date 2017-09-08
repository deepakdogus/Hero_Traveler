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
  height: 25px;
  margin-top: 10px;
`

const FacebookIcon = styled(StyledIcon)`
  width: 12.5px;
  padding: 0 9px;
`

const TwitterIcon = styled(StyledIcon)`
  width: 30.5px;
`

const InstagramIcon = styled(StyledIcon)`
  width: 25px;
  padding: 0 2.5px;
`

export default class ProfileBio extends React.Component {
  static PropTypes = {
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
          <BioText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sagittis nisl ac leo elementum eleifend. Etiam sit amet tempor odio. Sed ultricies faucibus interdum. Phasellus eu euismod dolor. Nam fringilla lorem at consectetur posuere. Nam laoreet arcu nulla, vitae vulputate lectus volutpat ac. Maecenas quis auctor libero, sed commodo leo.</BioText>
          <BioText>Aenean convallis metus vitae bibendum aliquet. Aenean tempus ex at ex pretium sagittis. In faucibus magna vel dolor ultrices vestibulum. Fusce metus velit, aliquam dapibus hendrerit vitae, scelerisque et orci. Sed blandit, enim eget condimentum eleifend, elit felis consectetur velit, vitae sagittis sapien massa eget velit.</BioText>
        </BioContainer>
        <SocialFooterContainer>
          <SocialFooterText>Follow me on:</SocialFooterText>
          <Row between='xs'>
            <FacebookIcon name='facebook-blue'/>
            <TwitterIcon name='twitter-blue'/>
            <InstagramIcon name='instagram'/>            
          </Row>
        </SocialFooterContainer>        
      </Container>
    )
  }
}
