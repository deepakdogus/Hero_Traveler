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
  @media (max-width: ${sizes.tablet}px) {
    font-size: 18px;
  }
`

const SponsorText = styled(CenteredText)`
  flex-basis: 49%;
  flex-shrink: 0;
  color: ${Colors.bioGrey};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 100;
  font-size: 10px;
  letter-spacing: 0.3px;
  text-align: right;
  justify-content: right;
  align-self: center;
`

const Wrapper = styled.div``

const SponsorWrapper = styled.div`
  display: flex;
  margin: 40px auto 20px;
  justify-content: ${props => props.noImage ? 'center' : 'space-between'};
  max-width: 300px;
  @media (max-width: ${sizes.phone}px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

const StyledImage = styled.img`
  flex-basis: 49%;
  flex-shrink: 0;
  height: 40px;
  width: 100px;
  object-fit: contain;
  justify-content: right;
`

const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  margin-bottom: 23px;
  max-width: 960px;
  @media (max-width: ${sizes.tablet}px) {
    display: none;
  }
`

export default class HeadlineDivider extends Component {
  static propTypes = {
    img: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    const { title, img } = this.props
    const Text = img ? SponsorText : FeedText
    return (
      <Wrapper>
        <SponsorWrapper noImage={!img}>
          <Text>{title || 'Sponsored by'}</Text>
          {img && <StyledImage src={getImageUrl(img)} />}
        </SponsorWrapper>
        <StyledDivider />
      </Wrapper>
    )
  }
}
