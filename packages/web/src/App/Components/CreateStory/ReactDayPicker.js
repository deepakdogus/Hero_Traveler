import React from 'react'
import styled from 'styled-components'

import DayPickerInput from "react-day-picker/DayPickerInput";
import "./Styles/ReactDayPickerStyles.css";


const InputContainer = styled.div`
  display: inline-block;
  margin-left: 22px;
  z-index: 100;
`

export default class ReactDayPicker extends React.Component {
  render() {
    return (
      <InputContainer>
        <DayPickerInput className="inputStyle" placeholder="MM-DD-YYYY" format="MM-DD-YYYY" />
      </InputContainer>
      )
  }
}















