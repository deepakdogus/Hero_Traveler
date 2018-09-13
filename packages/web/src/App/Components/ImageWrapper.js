import styled from 'styled-components'

function getSize(props) {
  switch(props.type) {
    case 'avatar':
      return '30px'
    case 'medium':
      return '50px'
    case 'large':
      return '62px'
    case 'larger':
      return '85px'
    case 'x-large':
      return '140px'
    default:
      return 'auto'
  }
}


export default styled.div`
  width: ${props => getSize};
  height: ${props => getSize};
  border-radius: ${props => props.type !== undefined ? '100%' : '0'};
`
