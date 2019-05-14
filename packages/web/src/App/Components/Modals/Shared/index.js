import styled from 'styled-components'
import VerticalCenter from '../../../Shared/Web/Components/VerticalCenter'
import Icon from '../../../Shared/Web/Components/Icon'

const basicTextStyle = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .2px;
`

// to be interpolated in rem
export const modalPadding = 2

export const Container = styled.div`
  position: relative;
  padding: ${modalPadding}rem calc(${modalPadding}rem + 10px);
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 20px;
  }
`

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.6px;
  text-align: center;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  padding: 30px 0;
  margin: 0;
`

export const RightTitle = styled.p`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 0.6px;
  text-align: center;
  margin: 0;
  padding: 20px;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
    line-height: 30px;
  }
`

export const Text = styled.p`
  ${basicTextStyle};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
  text-align: center;
  letter-spacing: 0.2px;
`

export const HasAccount = styled(Text)`
  font-size: 15px;
  margin: 0;
  padding: 30px 0;
`

export const SignupText = styled.span`
  ${basicTextStyle};
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.Colors.redHighlights};
  display: inline;
  cursor: pointer;
  letter-spacing: 0.2px;
`

export const StyledInput = styled.input`
  ${basicTextStyle};
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-bottom: 5px;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.Colors.dividerGrey};
  border-radius: 0;
  margin-bottom: 25px;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  letter-spacing: 0.2px;
  box-sizing : border-box;
`

export const ExteriorCloseXContainer = styled.div`
  position: absolute;
  top: -27.5px;
  right: -35px;
  z-index: 1000;
  height: 25px;
  width: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: none;
  }
`

//RightModal Styles

export const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`

export const UserNameStyles = `
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  margin: 0;
  cursor: pointer;
`

export const UserName = styled.p`
  ${UserNameStyles}
`

export const MessageContent = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.2px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export const Timestamp = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.2px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export const RightModalCloseX = styled(Icon)`
  position: absolute;
  top: 20px;
  left: 25px;
  height: 20px;
  width: 20px;
  cursor: pointer;
`

export const ErrorMessage = styled(Text)`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.redHighlights};
  letter-spacing: 0.2px;
`

export const FetchingMessage = styled(ErrorMessage)`
  color: ${props => props.theme.Colors.background};
`
