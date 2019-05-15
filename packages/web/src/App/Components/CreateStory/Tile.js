import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Row,
  Col,
} from '../../Shared/Web/Components/FlexboxGrid'
import Icon from '../../Shared/Web/Components/Icon'

const WrapperCol = styled(Col)`
  margin: 5px 10px;
`

const TextTile = styled(Row)`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  border-radius: 4px;
  height: 34px;
  z-index: 90;
  padding: 5px 10px;
`

const Text = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 15px;
  letter-spacing: .2px;
  margin: auto 0px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  height: 12px;
  width: 12px;
  margin-left: 10px;
`

export default class Tile extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    handleTileRemove: PropTypes.func,
  }

  _handleTileRemove = (event) => {
    const { text, handleTileRemove } = this.props
    handleTileRemove(event, text)
  }

  render() {
    const { text } = this.props

    return (
      <WrapperCol>
        <TextTile around='xs'>
          <Text>{text}</Text>
          <StyledIcon
            data-tagName={text}
            name='closeDark'
            onClick={this._handleTileRemove}
          />
        </TextTile>
      </WrapperCol>
    )
  }
}
