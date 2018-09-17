import styled from 'styled-components'
import { getSize } from './Icon'

function getSizeOverrideDefault(props){
  return getSize(props, 'auto')
}

export default styled.img`
  width: ${props => getSizeOverrideDefault};
  height: ${props => getSizeOverrideDefault};
  border-radius: ${props => props.type !== undefined ? '100%' : '0'};
`
