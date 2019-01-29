/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from '../../Icon'
import './buttonStyles.css'

const PlusButtonWrapper = styled.div`
  box-sizing: border-box;
  border: 1px solid #757575;
  margin: -5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  height: 36px;
  width: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
`

const Spacer = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 74px;
  height: 8px;
`

const Popup = styled.div`
  position: absolute;
  left: 50%;
  /* transform: translate(-50%); */
  background: #efefef;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 1px 3px 0px rgba(220,220,220,1);
  z-index: 3;
  box-sizing: border-box;
  width: 74px;
  margin-top: 8px;
  transform: ${({ transform }) => transform || 'unset'};
  transition: ${({ transition }) => transition || 'unset'};
  &:after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(251, 251, 251, 0);
    border-bottom-color: #fbfbfb;
    border-width: 4px;
    margin-left: -4px;
  }
  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(221, 221, 221, 0);
    border-bottom-color: #ddd;
    border-width: 6px;
    margin-left: -6px;
  }
`

const theme = {
  buttonWrapper: 'draftJsToolbar-buttonWrapper',
  button: 'draftJsToolbar-button',
  active: 'draftJsToolbar-button-active',
}

class BlockTypeSelect extends React.Component {
  state = {
    transform: 'translate(-50%) scale(0)',
  }

  onMouseEnter = () => {
    this.setState({
      transform: 'translate(-50%) scale(1)',
      transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
    })
  }

  onMouseLeave = () => {
    this.setState({
      transform: 'translate(-50%) scale(0)',
    })
  }

  onMouseDown = clickEvent => {
    clickEvent.preventDefault()
    clickEvent.stopPropagation()
  }

  render() {
    const { getEditorState, setEditorState } = this.props
    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
      >
        <PlusButtonWrapper>
          <Icon
            name='createPlus'
            size='extraMedium'
          />
        </PlusButtonWrapper>
        {/*
          The spacer is needed so the popup doesn't go away when moving from the
          blockType div to the popup.
        */}
        <Spacer />
        <Popup
          transform={this.state.transform}
          transition={this.state.transition}
        >
          {this.props.children({
            getEditorState,
            setEditorState,
            theme,
          })}
        </Popup>
      </div>
    )
  }
}

BlockTypeSelect.propTypes = {
  children: PropTypes.func,
}

export default BlockTypeSelect
