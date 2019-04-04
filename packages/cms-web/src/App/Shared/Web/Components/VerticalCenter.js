import styled from 'styled-components'

/*
separating out Styles so that we can apply these simulataneously
with another custom styled prop.
e.g. combining Overlay and VerticalCenter as seen in ExploreGrid
*/
export const VerticalCenterStyles = `
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export default styled.div`
  ${VerticalCenterStyles}
`
