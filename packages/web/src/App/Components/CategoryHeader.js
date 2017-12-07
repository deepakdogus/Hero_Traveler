import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from './Header'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'
import {OverlayStyles} from './Overlay'
import HeaderTopGradient from './Headers/Shared/HeaderTopGradient'
import getS3ImageUrl from '../Shared/Lib/getS3ImageUrl'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
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
  text-transform: uppercase;
  width: 160px;
  padding: 9px;
`

const textProps = `
  font-size: 14px;
  letter-spacing: 1.5px;
`

export default class CategoryHeader extends React.Component {
  static propTypes = {
    category: PropTypes.object,
  }

  render () {
    const {category} = this.props
    if (!category) return null
    const categoryImageUrl = getS3ImageUrl(category.image, 'versions.thumbnail240.path')
    return (
      <OpaqueHeaderImageWrapper
        backgroundImage={categoryImageUrl}
        size='large'
      >
        <HeaderTopGradient/>
        <Header isLoggedIn></Header>
        <Centered>
          <CategoryTitle>{category.title}</CategoryTitle>
          <StyledHorizontalDivider />
          <ButtonWrapper>
            <StyledRoundedButton
              type='categoryFollow'
              text='Follow'
              textProps={textProps}
            />
          </ButtonWrapper>
        </Centered>
      </OpaqueHeaderImageWrapper>
    )
  }
}
