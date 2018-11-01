import styled from 'styled-components'

import Avatar from '../Avatar'
import VerticalCenter from '../VerticalCenter'

export const UsernameBaseStyles = `
  font-weight: 600;
  font-size: 35px;
  margin: 0 0 0 -2px;
  text-align: left;
`

export const Username = styled.p`
  ${UsernameBaseStyles};
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.background};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 20px;
  }
`

export const Name = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro}};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  margin: 8px 0px;
  text-align: left;
  font-style: italic;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 13px;
    color: ${props => props.theme.Colors.redHighlights};
    margin: 2px 0px;
  }
`

export const Centered = styled(VerticalCenter)`
  position: relative;
  height: 365px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    max-height: 220px;
    display: flex;
    justify-content: flex-end;
  }
`

export const StyledAvatar = styled(Avatar)`
`

export const ButtonWrapper = styled.div`
  margin-top: 10px;
  text-align: left;
`

export const BottomLeftText = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  letter-spacing: .6px;
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 1px;
  margin: 0;
  padding-left: 10px;
  line-height: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 8px;
    font-weight: 600;
  }
`
