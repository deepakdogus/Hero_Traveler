import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from './FlexboxGrid'

const Container = styled.div`
  position: relative;
  margin: 20px;
`
const Left = styled(Row)`
  position: absolute;
  left: 0;
`
const Right = styled(Row)`
  position: absolute;
  right: 0;
`

// this Component should only be used for horizontal placement
export default class SpaceBetweenRowWithIconsAndButtons extends Component {
  static propTypes = {
    renderIcons: PropTypes.func,
    renderButtons: PropTypes.func,
  }

  render() {
    const {renderIcons, renderButtons} = this.props
    return (
      <Container>
        <Row>
          <Left>
            <Row>
              {renderIcons()}
            </Row>
          </Left>
          <Right>
            <Row>
              {renderButtons()}
            </Row>
          </Right>
        </Row>
      </Container>
    )
  }
}
