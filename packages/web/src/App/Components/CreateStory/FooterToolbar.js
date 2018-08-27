import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'
import Colors from '../../Shared/Themes/Colors'

const Container = styled.div`
  position: relative;
  margin: 20px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const Text = styled.p`
  color: ${Colors.redHighlights};
  margin: 0 auto;
`

export default class FooterToolbar extends Component {
  static propTypes = {
    isDetailsView: PropTypes.bool,
    discardDraft: PropTypes.func,
    updateDraft: PropTypes.func,
    onRight: PropTypes.func,
    onLeft: PropTypes.func,
    syncProgressMessage: PropTypes.string,
  }

  renderIcons = () => {
    const {discardDraft, updateDraft} = this.props
    return (
      <Row middle='xs'>
        <RoundedButton
          type='grey'
          padding='even'
          margin='medium'
          width='50px'
          height='50px'
          onClick={discardDraft}
        >
          <StyledIcon name='trash'/>
        </RoundedButton>
        <RoundedButton
          type='grey'
          padding='even'
          margin='medium'
          width='50px'
          height='50px'
          onClick={updateDraft}
        >
          <StyledIcon name='createSave'/>
        </RoundedButton>
      </Row>
    )
  }

  renderButtons = () => {
    const {
      isDetailsView,
      onRight,
      onLeft,
      syncProgressMessage
    } = this.props

    return (
      <Container>
        <Row middle='xs'>
        {syncProgressMessage === 'Publishing Story' &&
          <Text>{syncProgressMessage}...</Text>
        }
        </Row>
        <Row middle='xs'>
          <RoundedButton
            text={isDetailsView ? '< Back' : 'Preview'}
            margin='medium'
            padding='even'
            width='120px'
            type='grey'
            onClick={onLeft}
          />
          <RoundedButton
            text={isDetailsView ? 'Publish' : 'Next >'}
            margin='medium'
            padding='even'
            width='120px'
            onClick={onRight}
          />
        </Row>
      </Container>
    )
  }

  render() {
    return (
      <Container>
        <Row between='xs'>
          {this.renderIcons()}
          {this.renderButtons()}
        </Row>
      </Container>
    )
  }
}
