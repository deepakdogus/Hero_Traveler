import styled from 'styled-components'
import VerticalCenter from '../../VerticalCenter'
import Icon from '../../Icon'

const basicTextStyle = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
`

export const Container = styled.div`
  padding: 0 10px;
`

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-align: center;
`

export const RightTitle = styled.p`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  text-align: center;
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  margin: 0;
  padding: 20px;
`


export const CenterTitle = styled.p`
  font-weight: 400;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  text-align: center;
  background-color: ${props => props.theme.Colors.white};
  margin: 0;
  padding: 20px;
`

export const Text = styled.p`
  ${basicTextStyle};
  color: ${props => props.theme.Colors.grey};
  text-align: center;
`

export const HasAccount = styled(Text)`
  font-size: 15px;
  margin-top: 30px;
`

export const SignupText = styled.span`
  ${basicTextStyle};
  font-size: 15px;
  margin-top: 15px;
  font-weight: 600;
  color: ${props => props.theme.Colors.redHighlights};
  display: inline;
`

export const StyledInput = styled.input`
  ${basicTextStyle};
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-bottom: 5px;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.Colors.dividerGrey};
  margin-bottom: 25px;
`

export const SettingsStyledInput = styled.input`
  border-color: ${props => props.theme.Colors.dividerGrey};
  border-width: 0 0 1px;
  color: ${props => props.theme.Colors.background};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .7px;
  outline: none;
  padding-bottom: 8px;
  width: 100%;
`

//RightModal Styles

export const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`

export const UserName = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 0;
`

export const CommentContent = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`
export const MessageContent = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export const NotificationContent = styled.p`
  display: inline;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.background};
`

export const Timestamp = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export const ProfileDetail = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export const StyledInputLabel = styled.label`
  display: block;
  ${basicTextStyle};
  color: ${props => props.theme.Colors.navBarText};
  font-size: 14px;
  margin-bottom: 10px;
`

export const RightModalCloseX = styled(Icon)`
  position: absolute;
  top: 20px;
  left: 25px;
  height: 20px;
  width: 20px;
  cursor: pointer;
`
