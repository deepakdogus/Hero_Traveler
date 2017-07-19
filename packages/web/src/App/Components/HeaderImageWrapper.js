import styled from 'styled-components'

// overlay defaults to white with .4 opacity
export default styled.div`
  background-image: ${props => `url(${props.backgroundImage})`};
  background-repeat: no-repeat;
  background-size: cover;
  height: ${props => props.size === 'fullScreen' ? '100vh' : '180px'};
  position: relative;
`
