import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import getImageUrl from '../Shared/Lib/getImageUrl'
import { sizes } from '../Shared/Web/Themes/Metrics'
import { Colors } from '../Shared/Themes'
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
  color: ${Colors.bioGrey};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 100;
  font-size: 10px;
  letter-spacing: 0.3px;
  padding: 30px 0 5px;
  @media (max-width: ${sizes.tablet}px) {
    padding: 20px;
    font-size: 8px;
  }
  width: 100px;
  text-align: right;
  justify-content: right;
  margin-right: 5px;
`

const Wrapper = styled.div``

const SponsorWrapper = styled.div`
  display: flex;
  margin: 20px 0 auto;
  justify-content: center;

`

const ImageAndTextWrapper = styled.div`
  display: flex;
  width: 310px;
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
  margin-left: 5px;
  padding: 30px 0 5px;
  height: 40px;
  width: 100px;
  object-fit: contain;
  justify-content: right;
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
            <ImageAndTextWrapper>
              <SponsorText>{'Sponsored by'}</SponsorText>
              {<Img src={getImageUrl(img)} />}
            </ImageAndTextWrapper>
          </SponsorWrapper>
        )}
        <StyledDivider />
      </Wrapper>
    )
  }
}
