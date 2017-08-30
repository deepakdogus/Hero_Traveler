import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import background from '../Shared/Images/create-story.png'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import Icon from './Icon'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    background: rgba(0, 0, 0, .3);
  }
`

const Tagline = styled.p`
  font-weight: 300;
  font-size: 40px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .9px;
  margin: 0;
`

const ItalicText = styled.p`
  font-weight: 400;
  font-size: 17px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 630px;
  top:0;
  text-align:center;
  z-index: 2;
`

const Spacer = styled.div`
  height: 30px;
`
const BadgeSpacer = styled.div`
  width: 20px;
  display: inline-block;
`

const GooglePlayIcon = styled(Icon)`
  height: 90px;
  width: 232px;
  padding: 0px;
  margin: -14px;
  display: inline-block;
`

const AppleAppStoreIcon = styled(Icon)`
  height: 60px;
  width: 202px;
  display: inline-block;
`
const BadgeWrapper = styled.div`
  margin-top: 20px;
`

export default class ExploreHeader extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = {modal: undefined}
  }

  render () {
    return (
      <OpaqueHeaderImageWrapper
        backgroundImage={background}
        size='large'
        type='profile'
      >
        <Header isLoggedIn></Header>
        <Centered>
          <Tagline>For Travelers By Travelers</Tagline>
          <Spacer/>
          <ItalicText>Available on</ItalicText>
            <BadgeWrapper>
              <GooglePlayIcon
                name='googlePlayBadge'
              />
              <BadgeSpacer/>
              <AppleAppStoreIcon
                name='appleAppStoreBadge'
              />              
            </BadgeWrapper>
        </Centered>        
      </OpaqueHeaderImageWrapper>
    )
  }
}
