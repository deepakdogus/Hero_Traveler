import React from 'react'
import styled from 'styled-components'

import DayPicker from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";


const InputContainer = styled.div`
  display: inline-block;
  margin-left: 22px;
`
// const StyledForm = styled.form`
//   display: inline-block;
//   margin-left: 16px;
//   width: 80%;
// `

// const StyledLocation = styled.p`
//   font-weight: 600;
//   font-size: 14px;
//   letter-spacing: .7px;
//   color: ${props => props.theme.Colors.background};
//   margin: 0px;
// `

// const StyledAddress = styled.p`
//   font-weight: 400;
//   font-size: 14px;
//   letter-spacing: .7px;
//   color: ${props => props.theme.Colors.grey};
//   margin: 0px;
// `

// const styles = {
//   root: {
//     position: 'relative',
//     paddingBottom: '0px',
//   },
//   input: {
//     display: 'inline-block',
//     width: '100%',
//     padding: '10px',
//     outline: 'none',
//     border: 'none',
//     fontWeight: '400',
//     fontSize: '18px',
//     letterSpacing: '.7px',
//     color: `${props => props.theme.Colors.navBarText}`
//   },
//   autocompleteContainer: {
//     position: 'absolute',
//     top: '100%',
//     left: '30px',
//     backgroundColor: 'white',
//     border: 'none',
//     boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
//     width: '320px',
//     height: '400px',
//     padding: '5px',
//     overflowY: 'auto',
//   },
//   autocompleteItem: {
//     backgroundColor: '#ffffff',
//     padding: '10px',
//     color: '#555555',
//     cursor: 'pointer',
//     borderBottom: '1px solid #eeeeee',
//   },
//   autocompleteItemActive: {
//     backgroundColor: '#fafafa'
//   },
// }



export default class ReactDayPicker extends React.Component {
  render() {
    return (
      <InputContainer>
        <DayPickerInput className="inputStyle" placeholder="MM-DD-YYYY" format="MM-DD-YYYY" />
      </InputContainer>
      )
  }
}















