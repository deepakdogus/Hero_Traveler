import React from 'react'
import styled from 'styled-components'

import DayPicker from 'react-day-picker';
import './Styles/ReactDayPickerStyles.css';

import Icon from '../Icon'

const InputContainer = styled.div`
  display: inline-block;
  margin-left: 22px;
  z-index: 100;
`

const StyledIcon = styled(Icon)`
  height: 15px;
  width: 10px;
`


function Navbar({
  nextMonth,
  previousMonth,
  onPreviousClick,
  onNextClick,
  className,
  localeUtils,
}) {
  const months = localeUtils.getMonths();
  const prev = months[previousMonth.getMonth()];
  const next = months[nextMonth.getMonth()];
  const styleLeft = {
    float: 'left',
  };
  const styleRight = {
    float: 'right',
  };
  return (
    <div className={className}>
      <StyledIcon 
        name='arrowLeftRed'
        style={styleLeft} 
        onClick={() => onPreviousClick()}/>
      <StyledIcon 
        name='arrowRightRed'
        style={styleRight} 
        onClick={() => onNextClick()}/>
    </div>
  );
}

export default class ReactDayPicker extends React.Component {
  render() {
    return (
      <InputContainer>
        <DayPicker 
          navbarElement={<Navbar />} 
        />
      </InputContainer>
    )
  }
}















