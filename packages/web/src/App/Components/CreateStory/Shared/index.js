import styled from 'styled-components'

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

export const Text = styled.p`
  ${basicTextStyle};
  color: ${props => props.theme.Colors.grey};
  text-align: center;
`
