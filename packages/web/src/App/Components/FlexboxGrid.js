import { Grid, Row, Col } from 'react-flexbox-grid'
import styled from 'styled-components'

const StyledGrid = styled(Grid)`
  padding: 0 !important;
`

const StyledCol = styled(Col)`
  padding: 0 !important;
`

const StyledRow = styled(Row)`
  margin: 0 !important;
`

export {
  StyledGrid as Grid,
  StyledRow as Row,
  StyledCol as Col,
}
