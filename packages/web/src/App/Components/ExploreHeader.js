import React from 'react'
import styled from 'styled-components'

import background from '../Shared/Images/explore-hero.jpg'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import { OverlayStyles } from './Overlay'
import HeaderTopGradient from './Headers/Shared/HeaderTopGradient'
import { Images } from '../Shared/Themes'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
  overflow: hidden;
`

const Tagline = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 300;
  font-size: 40px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .9px;
  margin: 0 0 24px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 24px;
    margin: 0 0 12px 0;
  }
`

const ItalicText = styled.p`
  font-family: ${props => props.theme.Fonts.type.crimsonText};
  font-weight: 400;
  font-size: 17px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 570px;
  top:0;
  text-align:center;
  z-index: 2;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    top: 60px;
    height: 220px;
  }
`

const BadgeSpacer = styled.div`
  width: 20px;
  display: inline-block;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 15px;
  }
`

const BadgeWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-top: 12px;
  }
`

const GooglePlayImage = styled.img`
  height: 90px;
  width: 232px;
  padding: 0px;
  margin: -14px;
  overflow: hidden;
  display: inline-block;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 50px;
    width: 129px;
  }
`

const AppleAppStoreImage = styled.img`
  height: 60px;
  width: 202px;
  display: inline-block;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 33.33px;
    width: 112px;
  }
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
              <a href='https://itunes.apple.com/us/app/hero-traveler/id1288145566'>
                <AppleAppStoreImage src={Images.appleAppStoreBadge}/>
              </a>
            </BadgeWrapper>
        </Centered>
      </OpaqueHeaderImageWrapper>
    )
  }
}
