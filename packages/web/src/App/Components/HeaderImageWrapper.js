import styled from 'styled-components'

// overlay defaults to white with .4 opacity
export default styled.div`
  background: center ${props => `url(${props.backgroundImage})`};
  background-repeat: no-repeat;
  background-size: cover;
  height: ${props => {
    switch (props.size) {
      case 'fullScreen':
        return '100vh'
      case 'preview':
      case 'large':
        return '570px'
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
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    height: 280px;
  }
`
