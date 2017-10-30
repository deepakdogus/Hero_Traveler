import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import DayPicker from 'react-day-picker';
import './Styles/ReactDayPickerStyles.css';

import Icon from '../Icon'

const Container = styled.div``

const DayPickerContainer = styled.div`
  position: absolute;
  z-index: 100;
  left: 50px;
  top: 56px;
  height: 340px;
  width: 320px;
  padding: auto;
  background-color: white;
  outline: none;
  -webkit-box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

const StyledIconLeft = styled(Icon)`
  height: 18px;
  width: 10px;
  margin-left: 36px;
`

const StyledIconRight = styled(Icon)`
  height: 18px;
  width: 10px;
  margin-right: 26px;
`

function Navbar({
  nextMonth,
  previousMonth,
  onPreviousClick,
  onNextClick,
  className,
  localeUtils,
}) {
  const styleLeft = {
    float: 'left',
  };
  const styleRight = {
    float: 'right',
  };
  return (
    <div className={className}>
      <StyledIconLeft
        name='arrowLeftRed'
        style={styleLeft}
        onClick={onPreviousClick}/>
      <StyledIconRight
        name='arrowRightRed'
        style={styleRight}
        onClick={onNextClick}/>
    </div>
  );
}

export default class ReactDayPicker extends React.Component {
  static propTypes = {
    handleDayClick: PropTypes.func,
  }


  render() {
    return (
      <Container>
        <DayPickerContainer>
          <DayPicker
            navbarElement={<Navbar />}
            onDayClick={this.props.handleDayClick}
          />
        </DayPickerContainer>
      </Container>
    )
  }
}
