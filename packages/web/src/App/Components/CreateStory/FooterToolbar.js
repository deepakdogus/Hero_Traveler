import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../../Shared/Web/Components/Icon'
import {Row} from '../../Shared/Web/Components/FlexboxGrid'
import RoundedButton from '../../Shared/Web/Components/RoundedButton'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    justify-content: space-evenly;
  }
`

const StyledRow = styled(Row)`
  height: 75px;
`

const ButtonIconContainer = styled.div``

const StyledIcon = styled(Icon)`
  width: 35px;
  height: 35px;
  align-self: center;
  cursor: pointer;
`

const Text = styled.p`
  color: ${props => props.theme.Colors.redHighlights};
  margin: 0 auto;
`

export function TrashButton({ removeFeedItem }) {
  return (
    <RoundedButton
      type='grey'
      padding='even'
      margin='medium'
      width='50px'
      height='50px'
      onClick={removeFeedItem}
    >
      <StyledIcon name='trashLarge'/>
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
    const {
      discardDraft,
      updateDraft,
      syncProgressMessage,
    } = this.props

    return (
      <ButtonIconContainer>
        <StyledRow middle='xs'>
          <TrashButton removeFeedItem={discardDraft} />
          <RoundedButton
            type='grey'
            padding='even'
            margin='medium'
            width='50px'
            height='50px'
            onClick={updateDraft}
          >
            <StyledIcon name='createSaveLarge'/>
          </RoundedButton>
          {syncProgressMessage && syncProgressMessage.includes('Saving') &&
            <Text>{syncProgressMessage}</Text>
          }
        </StyledRow>
      </ButtonIconContainer>
    )
  }

  renderButtons = () => {
    const {
      isDetailsView,
      onRight,
      onLeft,
      syncProgressMessage,
    } = this.props

    return (
      <ButtonIconContainer>
        <Row middle='xs'>
        {syncProgressMessage && syncProgressMessage.includes('Publishing') &&
          <Text>{syncProgressMessage}</Text>
        }
        </Row>
        <StyledRow middle='xs'>
          {isDetailsView &&
          <RoundedButton
            text={'< Back'}
            margin='medium'
            padding='even'
            width='120px'
            type='grey'
            onClick={onLeft}
          />}
          <RoundedButton
            text={isDetailsView ? 'Publish' : 'Next >'}
            margin='medium'
            padding='even'
            width='120px'
            onClick={onRight}
          />
        </StyledRow>
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
