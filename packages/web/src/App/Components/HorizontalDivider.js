import styled from 'styled-components'

export default styled.hr`
  border-color: ${props => {
    switch (props.color) {
      case 'grey':
        return props.theme.Colors.lightGreyAreas
      default:
        return props.theme.Colors.snow
    }}
  };
  opacity: ${props => props.opaque ? .5 : 1};
  border-style: solid;
`
