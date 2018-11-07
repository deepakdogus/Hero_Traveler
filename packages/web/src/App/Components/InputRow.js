import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import VerticalCenter from './VerticalCenter'
import RoundedButton from './RoundedButton'
import {Row} from './FlexboxGrid'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
  position: fixed;
  right: 0;
  bottom: 0;
`

const FormContainer = styled.form`
  margin-right: 2%;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: auto;
  }
`

const StyledRow = styled(Row)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 20px;
  }
`

const InputFooter = styled.div`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  margin: 0;
  width: 510px;
  padding: 30px;
  height: 30px;
  position: relative;
  border-width 2px 0 0 0;
  border-color: ${props => props.theme.Colors.dividerGrey};
  border-style: solid;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100vw;
    padding: 30px 0;
  }
`

const StyledFooterInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  letter-spacing: .2px;
  width: 380px;
  color: ${props => props.theme.Colors.grey};
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 18px;
  outline: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 100%;
  }
`

export default class InputRow extends Component {
  static propTypes = {
    margin: PropTypes.string,
    onClick: PropTypes.func,
    handlingSubmit: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.state = {
      inputValue: ''
    }
  }

  onSend = () => {
    if (this.state.inputValue) this.props.onClick(this.state.inputValue)
  }

  _onSend = (e) => {
    //sends comment on 'enter' keydown
    e.preventDefault()
    if(this.state.inputValue) this.props.onClick(this.state.inputValue)
  }

  onChangeText = (event) => {
    this.setState({ inputValue: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.handlingSubmit && !nextProps.handlingSubmit) {
      this.setState({inputValue: ''})
    }
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <InputFooter>
          <VerticalCenter>
            <StyledRow>
              <FormContainer onSubmit={this._onSend}>
                <StyledFooterInput
                  value={this.state.inputValue}
                  placeholder='Add a comment...'
                  onChange={this.onChangeText}
                />
              </FormContainer>
                <RoundedButton
                  text='Send'
                  margin='none'
                  width='94px'
                  padding='medium'
                  onClick={this.onSend}
                />
            </StyledRow>
          </VerticalCenter>
        </InputFooter>
      </Container>
    )
  }
}
