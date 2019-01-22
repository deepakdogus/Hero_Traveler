import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid, Row, Col } from './FlexboxGrid'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Icon from './Icon'
import { VerticalCenterStyles } from './VerticalCenter'
import OverlayHover from './OverlayHover'

const StyledGrid = styled(Grid)`
  max-width: 1000px;
`

const Wrapper = styled.div`
  margin: 1px;
  position: relative;
  cursor: pointer;
`

const CategoryTile = styled.div`
  background: ${props => props.imageSource ? `url(${props.imageSource})` : '#efefef'};
  background-repeat: no-repeat;
  background-size: cover;
  width: 150px;
  height: 185px;
  margin: 0 auto;
  position: relative;
  border-radius: 10px;
`

// created specific component to optimize speed with _onClickTile
class Tile extends React.Component {
   static propTypes = {
    channel: PropTypes.object,
    onClick: PropTypes.func,
  }

  _onClickTile = () => {
    this.props.onClick(this.props.channel.id)
  }

  render(){
    const {channel} = this.props
    console.log('channel', channel)
    return (
      <Col xs={3} lg={2} >
        <Wrapper onClick={this._onClickTile}>
          <CategoryTile
            imageSource={
              getImageUrl(
                channel.channelImage,
                'categoryThumbnail',
                {width: 150, height: 185},
              )
            }
          />
        </Wrapper>
      </Col>
    )
  }
}

export default class DiscoverChannelsGrid extends React.Component {
  static propTypes = {
    channels: PropTypes.object,
    onClickChannel: PropTypes.func,
  }

  render() {
    const {channels, onClickChannel} = this.props

    const renderedCategories = channels.map((channel) => {
      return (
        <Tile
          key={channel.id}
          channel={channel}
          onClick={onClickChannel}
        />
      )
    })

    return (
      <StyledGrid fluid>
        <Row>
          {renderedCategories}
        </Row>
      </StyledGrid>
    )
  }
}
