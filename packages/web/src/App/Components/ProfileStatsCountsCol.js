import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Shared/Web/Components/Icon'
import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import {Text} from './Modals/Shared'

const StyledVerticalCenter = styled(VerticalCenter)`
  background-color: ${props => props.theme.Colors.dividerGrey};
  border-radius: 100%;
  width: 60px;
  height: 60px;
`

const VideoIcon = styled(Icon)`
  width: 39.5px;
  height: 24.5px;
`

const StoryIcon = styled(Icon)`
  width: 34px;
  height: 36.5px;
`

const DateIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`

const Count = styled.p`
  font-weight: 600;
  font-size: 20px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  margin: 10px 0 0;
`

const CountLabel = styled(Text)`
  font-size: 13px;
  color: ${props => props.theme.Colors.background};
  margin: 3px 0 0;
  letter-spacing: .2px;
`

const CountContainer = styled.div`
  margin: 50px 20px;
`

export default class ProfileStatsCountsCol extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    count: PropTypes.count,
    text: PropTypes.string,
  }

  getSelectedIcon() {
    switch (this.props.iconName) {
      case 'story':
        return StoryIcon
      case 'video':
        return VideoIcon
      case 'date':
      default:
        return DateIcon
    }
  }

  render() {
    const SelectedIcon = this.getSelectedIcon()
    const {count, text, iconName} = this.props
    return (
      <CountContainer>
        <StyledVerticalCenter>
          <SelectedIcon
            name={iconName}
            center
          />
        </StyledVerticalCenter>
        <Count>{count}</Count>
        <CountLabel>{text}</CountLabel>
      </CountContainer>
    )
  }
}
