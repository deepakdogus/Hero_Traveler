import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from '../FlexboxGrid'
import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import GoogleLocator from './GoogleLocator'

import ReactDayPicker from './ReactDayPicker'

import MultiTabSelect from './MultiTabSelect'
import {Title} from './Shared'

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';

const Container = styled.div`
`

const InputRowContainer = styled(Container)`
  padding: 20px 0px 14px 0px;
  position: relative;
`

const StyledTitle = styled(Title)`
  font-size: 28px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

const ActivitySelectRow = styled(Row)`
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 8px;
`

const StyledInput = styled.input`
  font-weight: 400;
  font-size: 18px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.navBarText};
  border-width: 0;
  margin-left: 25px;
`

const LocationIcon = styled(Icon)`
  height: 34px;
  width: 23px;
  margin-bottom: -12px;
  margin-left: 2px;
`

const DateIcon = styled(Icon)`
  height: 26px;
  width: 30px;  
  margin-bottom: -8px;
`
const TagIcon = styled(Icon)`
  height: 26px;
  margin-bottom: -8px;
  margin-left: 2px;
`

const styles = {
  radioButton: {
    display: 'inline-block',
    width: 120,
  },
  radioButtonLabel: {
    fontWeight: 600,
    fontSize: 18,
    color: '#1a1c21',
    letterSpacing: .7,
  },
  radioIcon: {
    fill: '#ed1e2e',
  },
  radioButtonGroup: {
    marginLeft: 40,
  },
}

export default class PhotoBox extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    closeImage: PropTypes.func,
    caption: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      hidePlaceholder: false
    };
  }
   
  togglePlaceholder = (areChips) => {
      this.setState({hidePlaceholder: areChips})
  }

  render() {
      return (
        <Container>
          <StyledTitle>{this.props.title} DETAILS</StyledTitle>
          <br/>
          <br/>
            <InputRowContainer>
              <LocationIcon name='location'/>
              <GoogleLocator/>              
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>            
            <InputRowContainer>
              <DateIcon name='date'/>
              <ReactDayPicker/>              
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>
            <InputRowContainer>
              <TagIcon name='tag'/>
              <StyledInput type='text' placeholder={!this.state.hidePlaceholder && 'Add tags'}/>
              <MultiTabSelect togglePlaceholder={this.togglePlaceholder}/>
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>                                     
            <InputRowContainer>
              <ActivitySelectRow>
                <label>Activity: </label>
                  <RadioButtonGroup name="activity" defaultSelected="eat" style={styles.radioButtonGroup}>
                    <RadioButton
                      value="eat"
                      label="EAT"
                      style={styles.radioButton}
                      labelStyle={styles.radioButtonLabel}
                      checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                      uncheckedIcon={<RadioButtonUnchecked/>}
                    />
                    <RadioButton
                      value="stay"
                      label="STAY"
                      style={styles.radioButton}
                      labelStyle={styles.radioButtonLabel}
                      checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                      uncheckedIcon={<RadioButtonUnchecked/>}
                    />
                    <RadioButton
                      value="do"
                      label="DO"
                      style={styles.radioButton}
                      labelStyle={styles.radioButtonLabel}
                      checkedIcon={<RadioButtonChecked style={{fill: '#ed1e2e'}} />}
                      uncheckedIcon={<RadioButtonUnchecked/>}
                    />
                  </RadioButtonGroup>                
              </ActivitySelectRow>                           
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>             
        </Container>
      )
  }
}










