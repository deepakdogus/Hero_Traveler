import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from '../Shared/Web/Components/RoundedButton'
import {OverlayStyles} from './Overlay'
import HeaderTopGradient from '../Shared/Web/Components/Headers/Shared/HeaderTopGradient'
import getImageUrl from '../Shared/Lib/getImageUrl'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
  background-position: center;
`

const CategoryTitle = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 59px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .6px;
  text-transform: uppercase;
  margin: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 25px;
  }
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 570px;
  top:0;
  text-align: center;
  z-index: 2;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 220px;
  }
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
  border-color: ${props => props.theme.Colors.whiteAlphaPt4};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

const ButtonWrapper = styled.div`
  margin-top: 24px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const StyledRoundedButton = styled(RoundedButton)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  text-transform: uppercase;
  width: 160px;
  padding: 9px;
  letter-spacing: .6px;
`

const textProps = `
  font-size: 14px;
  letter-spacing: .6px;
`

/* && hack needed here because of bug in styled-components that is placing
 * some classames in the incorrect order, causing css specificity issues
 */
const responsiveFollowButtonStyles = `
  && {
    width: 100px;
    padding: 3px;
  }
`

const responsiveFollowButtonTextStyles = `
  font-size: 10px;
`

export default class CategoryHeader extends React.Component {
  static propTypes = {
    category: PropTypes.object,
    user: PropTypes.object,
    followCategory: PropTypes.func,
    unfollowCategory: PropTypes.func,
    isFollowingCategory: PropTypes.bool,
  }

  _followCategory = () => {
    const { user, category } = this.props
    this.props.followCategory(category.id || user.id)
  }

  _unfollowCategory = () => {
    const { user, category } = this.props
    this.props.unfollowCategory(category.id || user.id)
  }

  render () {
    const { user, category, isFollowingCategory } = this.props
    if (!category && !user) return null
    const categoryImageUrl = getImageUrl((( category && category.image) || (user && user.channelImage)), 'image')
    return (
      <OpaqueHeaderImageWrapper
        backgroundImage={categoryImageUrl}
        size='large'
      >
        <HeaderTopGradient/>
        <Centered>
          <CategoryTitle>{(category && category.title) || (user && user.username)}</CategoryTitle>
          <StyledHorizontalDivider />
          <ButtonWrapper>
            <StyledRoundedButton
              type={isFollowingCategory ? '' : 'exploreCategoryFollow'}
              text={isFollowingCategory ? 'Following' : '+ Follow'}
              onClick={isFollowingCategory ? this._unfollowCategory : this._followCategory}
              textProps={textProps}
              responsiveTextProps={responsiveFollowButtonTextStyles}
              responsiveButtonProps={responsiveFollowButtonStyles}
            />
          </ButtonWrapper>
        </Centered>
      </OpaqueHeaderImageWrapper>
    )
  }
}
