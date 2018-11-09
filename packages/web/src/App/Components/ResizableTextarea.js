import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledResizableTextarea = styled.textarea`
  ${props => props.textProps}
  border: none;
  line-height: 24px;
  overflow: auto;
  height: auto;
  outline: none;
  resize: none;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  color: ${props => props.theme.Colors.grey};
`

export default class ResizableTextarea extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    rows: PropTypes.number,
    minRows: PropTypes.number,
    maxRows: PropTypes.number,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    textProps: PropTypes.string,
  }

  static defaultProps = {
    value: '',
    rows: 5,
    minRows: 5,
    maxRows: 500,
    placeholder: 'Enter some text...',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      rows: props.rows,
      minRows: props.minRows,
      maxRows: props.maxRows,
    }
  }

  _handleChange = event => {
    const textareaLineHeight = 24
    const { minRows, maxRows } = this.state
    const { onChange } = this.props

    const previousRows = event.target.rows
    event.target.rows = minRows // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight)

    if (currentRows === previousRows) {
      event.target.rows = currentRows
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows
      event.target.scrollTop = event.target.scrollHeight
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    })

    if (onChange) {
      event.stopPropagation()
      onChange(event)
    }
  }

  render() {
    return (
      <StyledResizableTextarea
        rows={this.state.rows}
        value={this.state.value}
        name={this.props.name}
        placeholder={this.state.placeholder}
        onChange={this._handleChange}
        textProps={this.props.textProps}
      />
    )
  }
}
