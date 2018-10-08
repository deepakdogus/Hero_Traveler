import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'

const Container = styled.div`
  position: relative;
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    justify-content: space-evenly;
  }
`

const ButtonIconContainer = styled.div``

const StyledIcon = styled(Icon)`
  align-self: center;
  cursor: pointer;
`

const TrashIcon = styled(StyledIcon)`
  width: 20px;
  height: 27px;
`

const Text = styled.p`
  color: ${props => props.theme.Colors.redHighlights};
  margin: 0 auto;
`

export function TrashButton({removeFeedItem}) {
  return (
    <RoundedButton
      type='grey'
      padding='even'
      margin='none'
      width='50px'
      height='50px'
      onClick={removeFeedItem}
    >
      <TrashIcon name='trash'/>
    </RoundedButton>
  )
}

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
      <ButtonIconContainer>
        <Row middle='xs'>
          <TrashButton removeFeedItem={discardDraft} />
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
      </ButtonIconContainer>
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
      <ButtonIconContainer>
        <Row middle='xs'>
        {syncProgressMessage &&
          <Text>{syncProgressMessage}</Text>
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
      </ButtonIconContainer>
    )
  }

  render() {
    return (
      <Container>
          {this.renderIcons()}
          {this.renderButtons()}
      </Container>
    )
  }
}
