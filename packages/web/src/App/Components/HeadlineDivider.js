import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import getImageUrl from '../Shared/Lib/getImageUrl'
import { sizes } from '../Shared/Web/Themes/Metrics'
import HorizontalDivider from './HorizontalDivider'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 0.6px;
  padding: 30px 0 0 0;
  @media (max-width: ${sizes.tablet}px) {
    padding: 20px;
    font-size: 18px;
  }
`

const SponsorText = styled(CenteredText)`
  color: #a9a9a9;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 100;
  font-size: 10px;
  letter-spacing: 0.3px;
  padding: 30px 15px 0 0;
  @media (max-width: ${sizes.tablet}px) {
    padding: 20px;
    font-size: 8px;
  }
  width: 200px;
  text-align: right;
`

const Wrapper = styled.div``

const SponsorWrapper = styled.div`
  display: flex;
  margin: 20px 0 auto;
  justify-content: center;
`

const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  margin-bottom: 23px;
  max-width: 960px;
  @media (max-width: ${sizes.tablet}px) {
    display: none;
  }
`

export const Img = styled.img`
  height: 100px;
  width: 200px;
  object-fit: contain;
`

export default class HeadlineDivider extends Component {
  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    const { title, img } = this.props
    return (
      <Wrapper>
        {!img ? (
          <FeedText>{title}</FeedText>
        ) : (
          <SponsorWrapper>
            <SponsorText>{'Sponsored by'}</SponsorText>
            {<Img src={getImageUrl(img)} />}
          </SponsorWrapper>
        )}
        <StyledDivider />
      </Wrapper>
    )
  }
}
