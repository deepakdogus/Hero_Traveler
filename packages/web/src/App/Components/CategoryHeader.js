import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'
import {OverlayStyles} from './Overlay'
import HeaderTopGradient from './Headers/Shared/HeaderTopGradient'
import getImageUrl from '../Shared/Lib/getImageUrl'

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
  height: 570px;
  top:0;
  text-align: center;
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
    followCategory: PropTypes.func,
    unfollowCategory: PropTypes.func,
    isFollowingCategory: PropTypes.bool,
  }

  _followCategory = () => {
    this.props.followCategory(this.props.category.id)
  }

  _unfollowCategory = () => {
    this.props.unfollowCategory(this.props.category.id)
  }

  render () {
    const {category, isFollowingCategory} = this.props

    if (!category) return null
    const categoryImageUrl = getImageUrl(category.image, 'image')
    return (
      <OpaqueHeaderImageWrapper
        backgroundImage={categoryImageUrl}
        size='large'
      >
        <HeaderTopGradient/>
        <Centered>
          <CategoryTitle>{category.title}</CategoryTitle>
          <StyledHorizontalDivider />
          <ButtonWrapper>
            <StyledRoundedButton
              type={isFollowingCategory ? 'blackWhite' : 'categoryFollow'}
              text={isFollowingCategory ? 'Following' : 'Follow'}
              textProps={textProps}
              onClick={isFollowingCategory ? this._unfollowCategory : this._followCategory}
            />
          </ButtonWrapper>
        </Centered>
      </OpaqueHeaderImageWrapper>
    )
  }
}
