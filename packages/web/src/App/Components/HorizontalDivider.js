import styled from 'styled-components'

function getColor(props) {
  switch (props.color) {
    case 'light-grey':
      return props.theme.Colors.dividerGrey
    case 'lighter-grey':
      return props.theme.Colors.navBarText
    case 'grey':
      return props.theme.Colors.lightGreyAreas
    default:
      return props.theme.Colors.snow
  }
}

export default styled.hr`
  border-color: ${getColor};
  background-color: ${getColor};
  opacity: ${props => props.opaque ? .5 : 1};
  border-style: solid;
  border-width: 1.1px;
`
