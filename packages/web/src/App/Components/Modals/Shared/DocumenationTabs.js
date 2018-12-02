import styled from 'styled-components'

export const DocumentationTabStyles = `
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
`

export const Container = styled.div``

export const Wrapper = styled.div`
  overflow: scroll;
  padding: 0px 15px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

export const Title = styled.p`
  ${DocumentationTabStyles}
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 16px;
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.background};
`

export const Header = styled.p`
  ${DocumentationTabStyles}
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.background};
`

export const Subtitle = styled(Header)``

export const BodyNumber = styled(Header)``

export const Body = styled.p`
  ${DocumentationTabStyles}
  font-family: ${props => props.theme.Fonts.type.base};
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.background};
`

export const OLBody = styled(Body)``

export const Link = styled.a`
  ${DocumentationTabStyles}
  font-family: ${props => props.theme.Fonts.type.base};
  letter-spacing: .2px;
  text-decoration: none;
  color: ${props => props.theme.Colors.background};
  &:visited {
    color: ${props => props.theme.Colors.background};
  }
`
