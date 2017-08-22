import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import HorizontalDivider from '../HorizontalDivider'
import GoogleLocator from './GoogleLocator'

import ReactDayPicker from './ReactDayPicker'

import MultiTabSelect from './MultiTabSelect'


const Container = styled.div`
`

const InputRowContainer = styled(Container)`
  padding: 20px 0px 14px 0px;
  position: relative;
`

const Title = styled.p`
  font-weight: 400;
  font-size: 28px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.5px;
  text-align: center;
  text-transform: uppercase;
`

const ActivityText = styled.p`
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

export default class PhotoBox extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    closeImage: PropTypes.func,
    caption: PropTypes.string,
  }

  render() {
      return (
        <Container>
          <Title>{this.props.title} DETAILS</Title>
          <br/>
          <br/>
            <InputRowContainer>
                <LocationIcon name='location'/><GoogleLocator/>              
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>            
            <InputRowContainer>
                <DateIcon name='date'/><ReactDayPicker/>              
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>
            <InputRowContainer>
                <TagIcon name='tag'/>
                <StyledInput type='text' placeholder='Add tags'/>
                <MultiTabSelect/>
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>                                     
            <InputRowContainer>
              <ActivityText>
                <label>Activity: </label>
                <label><StyledInput type='radio'/> Eat</label>
                <label><StyledInput type='radio'/> Stay</label>
                <label><StyledInput type='radio'/> Do</label>
              </ActivityText>                           
            </InputRowContainer>
            <HorizontalDivider color='lighter-grey'/>             
        </Container>
      )
  }
}










