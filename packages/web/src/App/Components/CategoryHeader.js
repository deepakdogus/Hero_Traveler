import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './Header'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'

import background from '../Shared/Images/create-story.png'

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

const HeaderTopGradient = styled.div`
  position: absolute;
  width: 100%;
  height: 180px;
  background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0));
`

const CategoryTitle = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 59px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
  text-transform: uppercase;
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

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
  border-color: ${props => props.theme.Colors.whiteAlphaPt4};
`

const ButtonWrapper = styled.div`
  margin-top: 24px;
`

const StyledRoundedButton = styled(RoundedButton)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 14px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  width: 160px;
  padding: 9px;
`

export default class FeedHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {modal: undefined}
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render () {
    const backgroundImage = background
    const ImageWrapper = backgroundImage ? OpaqueHeaderImageWrapper : HeaderImageWrapper
  
    return (
      <ImageWrapper
        backgroundImage={backgroundImage}
        size='large'
        type='profile'
      >
        <HeaderTopGradient/>
        <Header isLoggedIn></Header>
        <Centered>
          <CategoryTitle>JAPAN</CategoryTitle>
          <StyledHorizontalDivider />
          <ButtonWrapper>
            <StyledRoundedButton type='categoryFollow' text='Follow'/>
          </ButtonWrapper>
        </Centered>
      </ImageWrapper>
    )
  }
}
