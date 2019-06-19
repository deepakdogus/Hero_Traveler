import React from 'react'
import PropTypes from 'prop-types'
import {
  Marker,
  InfoWindow,
} from "react-google-maps";
import styled from 'styled-components'

import { Row } from '../Shared/Web/Components/FlexboxGrid'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'

const CoverImage = styled.img`
  width: 140px;
  height: 90px;
  object-fit: cover;
  cursor: pointer;
`

const Title = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  letter-spacing: .6px;
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.Colors.background};
  cursor: pointer;
  margin-left: 10px;
`

export default class MarkerWithPopup extends React.Component {
  static propTypes = {
    setSelectedMarkerId: PropTypes.func,
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    reroute: PropTypes.func,
  }

  onOpenMarker = () => {
    this.props.setSelectedMarkerId(this.props.id)
  }

  closeMarker = () => {
    this.props.setSelectedMarkerId(undefined)
  }

  rerouteToStory = () => {
    this.props.reroute(`/story/${this.props.id}`)
  }

  render() {
    const {
      isSelected,
      imageUrl,
      title,
      reroute,
    } = this.props

    return (
      <Marker
        clickable
        {...this.props}
        onClick={this.onOpenMarker}
      >
        {isSelected && reroute &&
          <InfoWindow
            onCloseClick={this.closeMarker}
          >
            <Row>
              <CoverImage
                src={imageUrl}
                onClick={this.rerouteToStory}
              />
              <VerticalCenter>
                <Title
                  onClick={this.rerouteToStory}
                >
                  {title}
                </Title>
              </VerticalCenter>
            </Row>
          </InfoWindow>
        }
      </Marker>
    )
  }
}
