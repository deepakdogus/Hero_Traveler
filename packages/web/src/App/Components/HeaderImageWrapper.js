import styled from 'styled-components'

// overlay defaults to white with .4 opacity
export default styled.div`
  background-image: ${props => `url(${props.backgroundImage})`};
  background-repeat: no-repeat;
  background-size: cover;
  height: ${props => {
    switch (props.size) {
      case 'fullScreen':
        return '100vh'
      case 'large':
        return '630px'
      default:
        return '180px;'
    }
  }};
  background-color: ${props => {
    if (props.backgroundImage) return undefined
    switch (props.type){
      case 'story':
        return props.theme.Colors.background
      case 'profile':
        return props.theme.Colors.redLight
      default:
        return undefined
    }
  }};
  position: relative;
`
