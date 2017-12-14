import React from 'react'
import styled from 'styled-components'

import background from '../Shared/Images/create-story.png'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import {OverlayStyles} from './Overlay'
import HeaderTopGradient from './Headers/Shared/HeaderTopGradient'
import {Images} from '../Shared/Themes'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
`

const Tagline = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 300;
  font-size: 40px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .9px;
  margin: 0 0 24px 0;
`

const ItalicText = styled.p`
  font-family: ${props => props.theme.Fonts.type.crimsonText};
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

const BadgeSpacer = styled.div`
  width: 20px;
  display: inline-block;
`

const BadgeWrapper = styled.div`
  margin-top: 20px;
`

const GooglePlayImage = styled.img`
  height: 90px;
  width: 232px;
  padding: 0px;
  margin: -14px;
  overflow: hidden;
  display: inline-block;
`

const AppleAppStoreImage = styled.img`
  height: 60px;
  width: 202px;
  display: inline-block;
`

export default class ExploreHeader extends React.Component {
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
        <HeaderTopGradient/>
        <Centered>
          <Tagline>For Travelers By Travelers</Tagline>
          <ItalicText>Available on</ItalicText>
            <BadgeWrapper>
              <GooglePlayImage src={Images.googlePlayBadge}/>
              <BadgeSpacer/>
              <AppleAppStoreImage src={Images.appleAppStoreBadge}/>
            </BadgeWrapper>
        </Centered>
      </OpaqueHeaderImageWrapper>
    )
  }
}
