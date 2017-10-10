import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const AbsoluteCenter = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: ${props => `-${2*props.size}px`};
  margin-top: ${props => `-${2*props.size}px`};
`

const Container = styled.div`
  width: ${props => `${props.size * 4}px`};
  height: ${props => `${props.size * 4}px`};
  display: inline-block;
  background-color: ${props => props.theme.Colors.windowTint};
  border-radius: 100%;
`

const CenterContainer = styled.div`
  margin: ${props => `${props.size * 2 - props.size}px`};
  height: ${props => `${props.size * 2}px`};
  display: inline-block;
`

const TestArrow = styled.div`
  display: inline-block;
  margin-left: ${props => `${props.size * .5}px`};
  border-left: ${props => `${props.size * 1.5}px solid white`};
  border-bottom: ${props => `${props.size}px solid transparent`};
  border-top: ${props => `${props.size}px solid transparent`};
`

export default class PlayButton extends Component {
  static propTypes = {
    size: PropTypes.number,
  }

  render() {
    const {size = 15} = this.props

    return (
      <AbsoluteCenter size={size}>
        <Container size={size}>
          <CenterContainer size={size}>
            <TestArrow size={size}/>
          </CenterContainer>
        </Container>
      </AbsoluteCenter>
    )
  }
}

